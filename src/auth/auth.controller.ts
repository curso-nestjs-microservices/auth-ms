import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthPatterns } from './enums';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AuthPatterns.register)
  registerUser() {
    return this.authService.registerUser();
  }

  @MessagePattern(AuthPatterns.login)
  login() {
    return this.authService.login();
  }

  @MessagePattern(AuthPatterns.verify)
  verifyToken() {
    return this.authService.verifyToken();
  }
}
