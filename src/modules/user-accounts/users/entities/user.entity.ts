import { CreateUserDto } from '../dto/create-user.dto';
import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

class EmailConfirmation {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
}

export class User {
  login: string;

  email: string;

  password: string;

  emailConfirmation: EmailConfirmation;

  createdAt: Date;

  updatedAt: Date;

  static createInstance(
    dto: CreateUserDto,
    hash: string,
    emailConfirmation: EmailConfirmation,
  ) {
    const user = new this();

    user.login = dto.login;
    user.password = hash;
    user.email = dto.email;
    user.emailConfirmation = emailConfirmation;

    return user;
  }

  setPassword(newHash: string): void {
    this.password = newHash;
  }

  resendEmail(code: string, expirationDate: Date) {
    this.emailConfirmation.confirmationCode = code;
    this.emailConfirmation.expirationDate = expirationDate;
    this.emailConfirmation.isConfirmed = false;
  }

  confirmEmail() {
    if (this.emailConfirmation.isConfirmed) {
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
    if (this.emailConfirmation.expirationDate < new Date()) {
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

    this.emailConfirmation.isConfirmed = true;
  }
}
