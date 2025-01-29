import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenType } from './schemas/tokens.schema';

@Injectable()
export class TokenService {
  constructor(@InjectModel(Token.name) private tokenModel: Model<Token>) {}

  async saveToken(userId: string, token: string, type: TokenType) {
    return this.tokenModel.create({ userId, token, type });
  }

  async findToken(token: string, type: string) {
    return this.tokenModel.findOne({ token, type });
  }

  async deleteToken(token: string, type: TokenType) {
    return this.tokenModel.deleteOne({ token, type });
  }
}
