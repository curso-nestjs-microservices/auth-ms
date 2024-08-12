import * as bcrypt from 'bcrypt';
import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto, RegisterUserDto } from './dto';
import { IJwtPayload } from './interfaces';
import { envs } from 'src/config';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('MongoDB connected!');
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { name, email, password } = registerUserDto;
    try {
      const user = await this.user.findUnique({
        where: { email },
      });

      if (user) {
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: 'User already exists',
        });
      }

      const newUser = await this.user.create({
        data: {
          email: email,
          name: name,
          password: bcrypt.hashSync(password, 10),
        },
      });

      delete newUser.password;

      return { user: await this._signJwt(newUser), token: 'ABC' };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    try {
      const user = await this.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: 'User/Password not valid',
        });
      }

      this._PasswordValidation(password, user.password);

      delete user.password;

      return { user, token: await this._signJwt(user) };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async verifyToken(token: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { sub, iat, exp, ...user } = this.jwtService.verify(token, {
        secret: envs.jwtSecret,
      });

      return {
        user,
        token: await this._signJwt(user),
      };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Invalid Token',
      });
    }
  }

  private async _signJwt(payload: IJwtPayload) {
    return this.jwtService.sign(payload);
  }

  private _PasswordValidation(inputPassword: string, userPassword: string) {
    const isValidPass = bcrypt.compareSync(inputPassword, userPassword);

    if (!isValidPass) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'User/Password not valid',
      });
    }

    return;
  }
}
