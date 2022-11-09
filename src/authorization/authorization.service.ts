import { UserDto } from '../dtos/user.dto';
import { LoginDto } from '../dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'models/user';

@Injectable()
export class AuthorizationService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.checkUser(loginDto);
    const loginInfo = {
      user,
      token: await this.generateToken(user),
    };

    return loginInfo;
  }

  async registration(userDto: UserDto) {
    const checkUser = await this.userService.getUserByUserName(
      userDto.userName,
    );

    if (checkUser) {
      throw new HttpException(
        'User with this userName already exists',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const hashedPassword = await bcrypt.hash(userDto.password, 5);
      const userInfo = await this.userService.createUser({
        ...userDto,
        password: hashedPassword,
      });

      const loginInfo = {
        user: userInfo,
        token: await this.generateToken(userInfo),
      };

      return loginInfo;
    }
  }

  async checkUser(loginDto: LoginDto) {
    const userInfo = await this.userService.getUserByUserName(
      loginDto.userName,
    );
    const checkPassword = await bcrypt.compare(
      loginDto.password,
      userInfo.password,
    );

    if (userInfo && checkPassword) {
      return userInfo;
    } else {
      throw new UnauthorizedException({
        message: 'Invalid userName or password',
      });
    }
  }

  async generateToken(user: User) {
    const payload = { id: user.id, userName: user.userName };

    return this.jwtService.sign(payload);
  }
}
