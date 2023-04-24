import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDTO } from './dto/loginUser.dto';
import { Request } from 'express';
import { ExpressRequest } from '@app/types/express.interface';
import { User } from './decorators/user.decorators';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDTO } from './dto/updateUser.dto';

@Controller({})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<any> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes()
  async login(
    @Body('user') loginUserDTO: LoginUserDTO,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginUserDTO);

    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateUser(
    @Body('user') updateUserDTO: UpdateUserDTO,
    @User('id') currentUserId: number,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(
      currentUserId,
      updateUserDTO,
    );
    return this.userService.buildUserResponse(user);
  }
}
