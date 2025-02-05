import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { User, UserRole } from './schemas/users.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Request, Response } from 'express';
import { SanitizeUser } from 'src/common/decorators/sanitize-user.decorator';
import { ApiSuccess } from 'src/common/utils/api-success';
import { UsersService } from './users.service';

export interface RequestWithUser extends Request {
  user: User;
}
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/private')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @SanitizeUser()
  async getUserData(@Req() req: RequestWithUser, @Res() res: Response) {
    // @ts-ignore
    console.log('user: ', req.user);
    const userdata = await this.usersService.findByEmail(req?.user?.email);
    return ApiSuccess.sendResponse(
      res,
      HttpStatus.OK,
      'User data fetched',
      userdata,
    );
  }
}
