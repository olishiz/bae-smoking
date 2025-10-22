import { Controller, Post, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, SessionDto } from '../common/dto/auth.dto';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  async logout(@Body() sessionDto: SessionDto) {
    return this.authService.logout(sessionDto.sessionToken);
  }

  @Post('session')
  async validateSession(@Body() sessionDto: SessionDto) {
    return this.authService.validateSession(sessionDto.sessionToken);
  }

  @Get('users')
  async getAllUsers() {
    return this.authService.getAllUsernames();
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', message: 'Server is running' };
  }
}
