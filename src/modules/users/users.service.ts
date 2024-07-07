import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt';
import { PrismaService } from '@app/core/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ResponseDto } from '@app/common/dto/response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly db: PrismaService,
    private jwtService: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.db.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    createUserDto.password = hashSync(createUserDto.password, 10);
    const user = await this.db.user.create({ data: createUserDto });

    const access_token = await this.generateJWTToken({
      id: user.id,
      email: user.email,
    });

    return new ResponseDto(user, 'Register successfully', {
      access_token,
    });
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.db.user.findUnique({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const isPasswordCorrect = compareSync(loginUserDto.password, user.password);

    if (!isPasswordCorrect) {
      throw new BadRequestException('Password is incorrect');
    }

    const access_token = await this.generateJWTToken({
      id: user.id,
      email: user.email,
    });

    return new ResponseDto(user, 'Login successfully', {
      access_token,
    });
  }

  private async generateJWTToken(payload: object) {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}
