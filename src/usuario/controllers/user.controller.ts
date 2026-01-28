import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';

@Controller('/usuarios')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
 @Get()
    getAllUsers(): Promise<User[]> { 
        return this.userService.getAllUsers();
    }

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post()
  createUser(@Body() user: User): Promise<User> {
    return this.userService.createUser(user);
  }

  @Put()
  updateUser(@Body() usuario: User): Promise<User> {
    return this.userService.updateUser(usuario);
  }

  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}