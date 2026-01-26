import { ThrottlerGuard } from '@nestjs/throttler';
import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../exceptions/domain-exceptions';

@Injectable()
export class IpThrottlerGuard extends ThrottlerGuard {
  protected throwThrottlingException(): Promise<void> {
    throw new DomainException({
      status: HttpStatus.TOO_MANY_REQUESTS,
      errorsMessages: [
        {
          message: 'Too many requests. Try again later',
          field: 'rateLimit',
        },
      ],
    });
  }
}
