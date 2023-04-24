import { Get, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserEntity } from '@app/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDTO } from './dto/loginUser.dto';
import { compare } from 'bcrypt';
import { UpdateUserDTO } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    const userByUsername = await this.userRepository.findOne({
      where: {
        username: createUserDto.username,
      },
    });

    // if (userByEmail) {
    //   this.createUserErrors['email'] = ['has alread been taken'];
    // }

    // if (userByUsername) {
    //   this.createUserErrors['username'] = ['has alread been taken'];
    // }

    if (userByEmail || userByUsername) {
      throw new HttpException(
        'has alread been taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): any {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }

  async login(LoginUserDTO: LoginUserDTO): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email: LoginUserDTO.email,
      },
    });

    console.log('user', LoginUserDTO);
    console.log('user', user.email);
    console.log('user', user.hashpassword);

    if (!user) {
      throw new HttpException(
        'Credentials not correct',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // const isPasswordCorrect = await compare(
    //   LoginUserDTO.password,
    //   user.password,
    // );

    // if (!isPasswordCorrect) {
    //   throw new HttpException(
    //     'Credentials not correct',
    //     HttpStatus.UNPROCESSABLE_ENTITY,
    //   );
    // }

    // delete user.password;

    return user;
  }

  async findByID(id: number): Promise<UserEntity> {
    console.log('id', id);
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async updateUser(
    userID: number,
    updateUserDTO: UpdateUserDTO,
  ): Promise<UserEntity> {
    const user = await this.findByID(userID);
    Object.assign(user, updateUserDTO);
    return this.userRepository.save(user);
  }
}
