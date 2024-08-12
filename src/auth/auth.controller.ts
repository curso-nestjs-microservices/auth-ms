import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthPatterns } from './enums';
import { LoginUserDto, RegisterUserDto } from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AuthPatterns.register)
  registerUser(@Payload() payload: RegisterUserDto) {
    return this.authService.registerUser(payload);
  }

  @MessagePattern(AuthPatterns.login)
  loginUser(@Payload() payload: LoginUserDto) {
    return this.authService.loginUser(payload);
  }

  @MessagePattern(AuthPatterns.verify)
  verifyToken(@Payload() token: string) {
    return this.authService.verifyToken(token);
  }
}
