import { add } from 'date-fns/add';
import { randomUUID } from 'node:crypto';
import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

export class PasswordRecovery {
  userId: string;

  recoveryCode: string;

  expirationDate: Date;
  isUsed: boolean;

  static createForUser(userId: string) {
    const recovery = new this();
    recovery.userId = userId;
    recovery.recoveryCode = randomUUID();
    recovery.expirationDate = add(new Date(), { minutes: 30 });
    recovery.isUsed = false;

    return recovery;
  }

  validateRecoveryCode(): void {
    if (this.isUsed || this.expirationDate < new Date()) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Code is invalid',
            field: 'code',
          },
        ],
      });
    }
  }

  markAsUsed(): void {
    this.isUsed = true;
  }
}
