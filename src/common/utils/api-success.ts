import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export class ApiSuccess {
  static sendResponse(
    res: Response,
    statusCode: number = HttpStatus.OK,
    message: string = 'Success',
    data: any = {},
    tokens?: { accessToken: string; refreshToken: string },
    url?: string,
  ) {
    const respObj: any = {
      code: statusCode,
      message,
      isSuccess: true,
      data: data ?? {},
    };

    if (url) {
      respObj.url = url;
    }

    if (tokens) {
      respObj.accessToken = tokens.accessToken;
      respObj.refreshToken = tokens.refreshToken;
    }

    console.log(respObj);
    return res.status(statusCode).json(respObj);
  }
}
