import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SanitizeUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (!data) return data;
        console.log(data);
        if (Array.isArray(data)) {
          return data.map(({ password, ...rest }) => rest);
        }

        const { password, ...rest } = data;
        console.log(rest);
        return rest;
      }),
    );
  }
}
