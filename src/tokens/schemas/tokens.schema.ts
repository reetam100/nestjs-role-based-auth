import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

@Schema({ timestamps: true })
export class Token extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true, enum: TokenType })
  type: TokenType;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
