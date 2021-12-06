import {Body, Controller, Get, Post, Req, UsePipes, ValidationPipe} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {userResponseInterface} from "./types/userResponse";
import {LoginUserDto} from "./dto/login-user.dto";
import {ExpressRequestInterface} from "./types/expressRequestInterface";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<userResponseInterface> {
    const user =  await this.userService.createUser(createUserDto)
    return this.userService.buildUserResponse(user)
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async loginUser(@Body('user') loginUserDto: LoginUserDto): Promise<userResponseInterface> {
    const user = await this.userService.loginUser(loginUserDto)
    return this.userService.buildUserResponse(user)
  }

  @Get()
  async currenUser(@Req() request: ExpressRequestInterface): Promise<userResponseInterface> {
    return this.userService.buildUserResponse(request.user)
  }
}
