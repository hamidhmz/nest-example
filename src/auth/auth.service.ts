import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  public signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ username: string; id: number }> {
    return this.userRepository.signUp(authCredentialsDto);
  }
  public async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const isAuthenticated = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!isAuthenticated)
      throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.jwtService.sign({
      username: authCredentialsDto.username,
    });
    return { accessToken };
  }
}
