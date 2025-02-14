import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';
import { UserRole } from 'src/users/schemas/users.schema';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsEnum(UserRole)
  role: 'user' | 'admin';
}

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}
