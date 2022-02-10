import { LoginUserDto } from './dto/loginUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { sign } from 'jsonwebtoken';
import { JSW_SECRET } from './../config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { compare } from 'bcrypt';
import { EditUserDto } from './dto/editUser.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne(
      {
        email: loginUserDto.email,
      },
      {
        select: ['id', 'username', 'email', 'bio', 'image', 'password'],
      },
    );
    if (!userByEmail) {
      throw new HttpException(
        'User doesnt exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const isPasswordRight = await compare(
      loginUserDto.password,
      userByEmail.password,
    );
    if (!isPasswordRight) {
      throw new HttpException(
        'Wrong password',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    delete userByEmail.password;
    return await userByEmail;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmailOrUsername = await this.userRepository.findOne({
      where: [
        {
          email: createUserDto.email,
        },
        {
          username: createUserDto.username,
        },
      ],
    });
    if (userByEmailOrUsername) {
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async editUser(
    userDto: EditUserDto,
    currentUserId: UserEntity['id'],
  ): Promise<UserEntity> {
    const user = await this.findById(currentUserId);
    return this.userRepository.save({
      ...user,
      ...userDto,
    });
  }

  findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      id,
    });
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JSW_SECRET,
      {
        expiresIn: '1h',
      },
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
