import { faker } from '@faker-js/faker';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from 'models/user';
import { UserDto } from 'src/dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}
  async createUser(userDto: UserDto) {
    const { userName, firstName, lastName, password } = userDto;
    if (
      userName.trim() &&
      firstName.trim() &&
      lastName.trim() &&
      password.trim()
    ) {
      const newUser = await this.userModel.create({
        id: faker.datatype.uuid(),
        ...userDto,
      });

      return newUser;
    } else {
      throw new HttpException(
        'All fields must be filled in',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAll() {
    const users = await this.userModel.findAll();

    return users;
  }

  async getOneUser(id) {
    const user = await this.userModel.findByPk(id);
    if (user) {
      return user;
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async getUserByUserName(userName) {
    const user = await this.userModel.findOne({
      where: { userName },
    });

    return user;
  }

  async editUser(password: string, id) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (password['password'].trim()) {
      const hashedPassword = await bcrypt.hash(password['password'], 5);

      await this.userModel.update(
        {
          password: hashedPassword,
        },
        { where: { id } },
      );
    } else {
      throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
    }

    const updateUsers = await this.userModel.findByPk(id);
    return updateUsers;
  }
}
