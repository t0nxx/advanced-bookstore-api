import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseSerializeInterceptor } from '@app/common/interceptors/response-serialize.interceptor';
import { ReadUserDto } from './dto/read-user.dto';
import { LoginUserDto } from './dto/login.dto';

@Controller('users')
@ApiTags('users')
@UseInterceptors(new ResponseSerializeInterceptor(ReadUserDto))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }
}
