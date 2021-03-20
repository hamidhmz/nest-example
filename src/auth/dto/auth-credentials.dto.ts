import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(4)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(4)
  password: string;
}
