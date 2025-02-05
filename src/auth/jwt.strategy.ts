import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ApiError } from 'src/common/utils/api-error';
import { TokenType } from 'src/tokens/schemas/tokens.schema';
import { TokenService } from 'src/tokens/tokens.service';
import { UsersService } from 'src/users/users.service';
// import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly tokensService: TokenService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // Replace with a secure key
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    // ✅ Extract the token from the authorization header
    const tokenFromHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!tokenFromHeader) {
      throw new UnauthorizedException('No token provided');
    }

    // ✅ Check if the token exists in the database
    const token = await this.tokensService.findToken(
      tokenFromHeader,
      TokenType.ACCESS,
    );
    if (!token) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const user = await this.usersService.findById(payload.sub);
    return user; // ✅ Token is valid, return user payload
  }
}
