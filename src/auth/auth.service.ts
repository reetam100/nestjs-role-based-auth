import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../tokens/tokens.service';
import { TokenType } from 'src/tokens/schemas/tokens.schema';
// import { TokenService } from '../token/token.service';
// import { TokenType } from '../token/schemas/token.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    console.log('user: ', user);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });

    await this.tokenService.saveToken(user._id, accessToken, TokenType.ACCESS);
    await this.tokenService.saveToken(
      user._id,
      refreshToken,
      TokenType.REFRESH,
    );

    return { user, accessToken, refreshToken };
  }

  async refreshToken(oldRefreshToken: string) {
    const existingToken = await this.tokenService.findToken(
      oldRefreshToken,
      TokenType.REFRESH,
    );
    if (!existingToken)
      throw new UnauthorizedException('Invalid refresh token');

    const user = await this.usersService.findById(existingToken.userId);
    await this.tokenService.deleteToken(oldRefreshToken, TokenType.REFRESH);

    return this.login(user);
  }
}
