import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TokensModule } from './tokens/tokens.module';
import { EmailModule } from './email/email.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    UsersModule,
    TokensModule,
    EmailModule,
    SocketModule,
  ],
})
export class AppModule {
  constructor() {
    // console.log(process.env.MONGO_URI);
  }

  public run() {
    console.log('Hello: ', process.env.MONGO_URI);
  }
}

new AppModule().run();
