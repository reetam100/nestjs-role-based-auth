import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/users/schemas/users.schema';
import { EmailService } from 'src/email/email.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; role?: UserRole },
  ) {
    const user = await this.usersService.register(
      body.email,
      body.password,
      body.role,
    );
    await this.emailService.sendEmail(
      body.email,
      'Registered successfully',
      'd-e9d31fe5508742a399d5a0d2a5fb5b4c',
      {
        TEXT: 'You have been registered successfully',
      },
    );
    return { message: 'User registered successfully', userId: user._id };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);

    // 2️⃣ Pass the found user object to login()
    return this.authService.login(user);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
