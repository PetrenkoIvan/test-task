import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserDto } from 'src/dtos/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAll();
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getOneUser(id);
  }

  @Post()
  createUser(@Body() userDto: UserDto) {
    return this.userService.createUser(userDto);
  }

  @Patch('change-password/:id')
  editUser(@Body() password: string, @Param('id') id: string) {
    return this.userService.editUser(password, id);
  }
}
