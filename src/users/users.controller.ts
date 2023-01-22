import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { UserDto } from './dtos/user.dto';
import { Serializable } from 'src/interceptors/serialize.interceptor';

@Controller('auth')
@Serializable(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.usersService.create(body.email, body.password);
    console.log(body);
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    console.log('ejecutando el handler');
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      return new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.updated(parseInt(id), body);
  }
}
