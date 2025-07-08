import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(createAuthDto: CreateAuthDto) {
    // In a real application, you would interact with Supabase here
    // For now, we'll just simulate a user creation and return a token
    const user = { username: createAuthDto.email, password: createAuthDto.password }; // Placeholder
    const payload = { username: user.username, sub: user.username }; // Placeholder for user ID
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    // In a real application, you would interact with Supabase here to verify credentials
    // For now, we'll just simulate a successful login and return a token
    const user = { username: loginAuthDto.email, password: loginAuthDto.password }; // Placeholder
    const payload = { username: user.username, sub: user.username }; // Placeholder for user ID
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
