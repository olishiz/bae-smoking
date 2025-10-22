import { IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(4)
  password: string;
}

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class SessionDto {
  @IsString()
  sessionToken: string;
}

export class AuthResponseDto {
  success: boolean;
  message: string;
  sessionToken?: string;
  username?: string;
}
