import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  registerUser() {
    return 'registerUser';
  }

  login() {
    return 'login';
  }

  verifyToken() {
    return 'verifyToken';
  }
}
