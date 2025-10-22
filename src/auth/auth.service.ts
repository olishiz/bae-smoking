import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RegisterDto, LoginDto } from '../common/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async register(registerDto: RegisterDto): Promise<{ success: boolean; message: string }> {
    const { username, password } = registerDto;

    if (!username || !password) {
      throw new BadRequestException('Username and password are required');
    }

    if (username.length < 3) {
      throw new BadRequestException('Username must be at least 3 characters');
    }

    if (password.length < 4) {
      throw new BadRequestException('Password must be at least 4 characters');
    }

    const existingUser = await this.databaseService.getUserByUsername(username);
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const created = await this.databaseService.createUser(username, password);

    if (created) {
      return {
        success: true,
        message: 'Registration successful!',
      };
    } else {
      throw new BadRequestException('Error saving user data');
    }
  }

  async login(loginDto: LoginDto): Promise<{ success: boolean; message: string; sessionToken: string; username: string }> {
    const { username, password } = loginDto;

    if (!username || !password) {
      throw new BadRequestException('Username and password are required');
    }

    const user = await this.databaseService.getUserByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Incorrect password');
    }

    const sessionToken = await this.databaseService.createSession(username);

    return {
      success: true,
      message: 'Login successful!',
      sessionToken,
      username,
    };
  }

  async logout(sessionToken: string): Promise<{ success: boolean; message: string }> {
    if (!sessionToken) {
      throw new BadRequestException('Session token required');
    }

    await this.databaseService.deleteSession(sessionToken);

    return {
      success: true,
      message: 'Logout successful',
    };
  }

  async validateSession(sessionToken: string): Promise<{ success: boolean; username?: string; message?: string }> {
    if (!sessionToken) {
      throw new UnauthorizedException('Not authenticated');
    }

    const session = await this.databaseService.getSession(sessionToken);

    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }

    return {
      success: true,
      username: session.username,
    };
  }

  async getAllUsernames(): Promise<{ success: boolean; usernames: string[] }> {
    const usernames = await this.databaseService.getAllUsernames();
    return {
      success: true,
      usernames,
    };
  }
}
