import { UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '123654',
    });
  }

  public async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOne({
      username: payload.username,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
