import { UserDto } from '../dtos/user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { LoginDto } from 'src/dtos/login.dto';

@Controller('authorization')
export class AuthorizationController {
  constructor(private authServices: AuthorizationService) {}

  @Post('/registration')
  async registration(@Body() userDto: UserDto) {
    const userInfo = await this.authServices.registration(userDto);
    return userInfo;
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const userInfo = await this.authServices.login(loginDto);
    return userInfo;
  }
}
