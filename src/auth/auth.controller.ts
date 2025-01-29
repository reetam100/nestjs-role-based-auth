import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/users/schemas/users.schema';
import { SanitizeUser } from 'src/common/decorators/sanitize-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
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
    return { message: 'User registered successfully', userId: user._id };
  }

  @Post('login')
  @SanitizeUser()
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
