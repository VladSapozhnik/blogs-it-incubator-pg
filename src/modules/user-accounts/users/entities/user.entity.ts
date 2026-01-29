import { CreateUserDto } from '../dto/create-user.dto';
import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

export class EmailConfirmation {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
}

export class User {
  id: string;

  login: string;

  email: string;

  password: string;

  confirmationCode: string;

  expirationDate: Date;

  isConfirmed: boolean;

  createdAt: Date;

  updated_at: Date;

  static createInstance(
    dto: CreateUserDto,
    hash: string,
    emailConfirmation: EmailConfirmation,
  ) {
    const user = new this();

    user.login = dto.login;
    user.password = hash;
    user.email = dto.email;
    user.confirmationCode = emailConfirmation.confirmationCode;
    user.expirationDate = emailConfirmation.expirationDate;
    user.isConfirmed = emailConfirmation.isConfirmed;

    return user;
  }

  setPassword(newHash: string): void {
    this.password = newHash;
  }

  resendEmail(code: string, expirationDate: Date) {
    this.confirmationCode = code;
    this.expirationDate = expirationDate;
    this.isConfirmed = false;
  }

  confirmEmail() {
    if (this.isConfirmed) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Email already confirmed',
            field: 'User',
          },
        ],
      });
    }
    if (this.expirationDate < new Date()) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Confirmation code expired',
            field: 'code',
          },
        ],
      });
    }

    this.isConfirmed = true;
  }
}
