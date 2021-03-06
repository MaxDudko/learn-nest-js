import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserEntity} from "./user.entity";
import {CreateUserDto} from "./dto/create-user.dto";
import {sign, decode, verify} from "jsonwebtoken";
import {JWT_SECRET} from "../config";
import {userResponseInterface} from "./types/userResponse";
import {LoginUserDto} from "./dto/login-user.dto";
import {compare} from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email
    });
    const userByUsername = await this.userRepository.findOne({
      username: createUserDto.username
    });

    if (userByEmail || userByUsername) {
      throw new HttpException('Email or username are taken', HttpStatus.UNPROCESSABLE_ENTITY)
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto)
    return await this.userRepository.save(newUser);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findOne({
      email: loginUserDto.email
    }, {select: ['id', 'username', 'email', 'bio', 'image', 'password']})

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password
    )

    if (!user || !isPasswordCorrect) {
      throw new HttpException('Wrong email or password', HttpStatus.UNPROCESSABLE_ENTITY)
    }

    delete user.password
    return user
  }

  generateJWT(user: UserEntity): string {
    return sign({
      id: user.id,
      username: user.username,
      email: user.email
    }, JWT_SECRET)
  }

  buildUserResponse(user: UserEntity): userResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJWT(user)
      }
    }
  }

  async findById(id: null): Promise<UserEntity> {
    return this.userRepository.findOne({id})
  }
}
