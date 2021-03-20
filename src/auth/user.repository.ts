import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const user = new User();
    user.username = authCredentialsDto.username;
    const { hash } = await this.hashPassword(authCredentialsDto.password, 10);

    user.password = hash;
    return user.save().catch(error => {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists.');
      }
      // throw new InternalServerErrorException();
      throw error;
    });
  }

  public async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<boolean> {
    const user = await this.findOne({ username: authCredentialsDto.username });
    return this.comparePassword(authCredentialsDto.password, user.password);
  }

  private comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hashedPassword, function(err, isMatch) {
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
