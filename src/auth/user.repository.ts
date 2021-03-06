import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ username: string; id: number }> {
    const user = new User();
    user.username = authCredentialsDto.username;
    const { hash } = await this.hashPassword(authCredentialsDto.password, 10);

    user.password = hash;
    await user.save().catch(error => {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists.');
      }
      // throw new InternalServerErrorException();
      throw error;
    });

    return { username: user.username, id: user.id };
  }

  public async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<boolean> {
    const user = await this.findOne({ username: authCredentialsDto.username });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    return this.comparePassword(authCredentialsDto.password, user.password);
  }

  private comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hashedPassword, function(
        err: Error,
        isMatch: boolean,
      ) {
        if (err) reject(err);
        resolve(isMatch);
      });
    });
  }

  private hashPassword(
    password: string,
    saltRounds: number,
  ): Promise<{ hash: string; salt: string }> {
    if (saltRounds > 20) {
      throw 'salt should be less than 20';
    }
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, function(err: Error, salt: string) {
        if (err) reject(err);
        bcrypt.hash(password, salt, function(err: Error, hash: string) {
          if (err) reject(err);
          resolve({ hash, salt });
        });
      });
    });
  }
}
