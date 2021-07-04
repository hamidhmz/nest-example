import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/sign-up')
  @UsePipes(ValidationPipe)
  signUp(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ username: string; id: number }> {
    return this.authService.signUp(authCredentialsDto);
  }
  @Post('/sign-in')
  @UsePipes(ValidationPipe)
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/test')
  @UseGuards(AuthGuard('jwt'))
  test(@GetUser() user: User): User {
    return user;
  }
}
