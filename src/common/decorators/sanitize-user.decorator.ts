import { UseInterceptors } from '@nestjs/common';
import { SanitizeUserInterceptor } from '../interceptors/sanitize-user.interceptor';

export function SanitizeUser() {
  return UseInterceptors(SanitizeUserInterceptor);
}
