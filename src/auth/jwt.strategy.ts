import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenService } from 'src/tokens/tokens.service';
// import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly tokensService: TokenService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key', // Replace with a secure key
    });
  }

  async validate(payload: any) {
    const token = await this.tokensService.findToken(payload.sub, 'access');
    if (!token) {
      return null; // Token not found in the database
    }
    return payload;
  }
}
