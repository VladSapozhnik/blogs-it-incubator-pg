import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http'; // Импортируем как Strategy
import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class SuperAdminStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  validate(username: string, password: string): any {
    if (username === 'admin' && password === 'qwerty') {
      return true;
    }

    throw new DomainException({
      status: HttpStatus.UNAUTHORIZED,
      errorsMessages: [
        {
          field: 'admin',
          message: 'Unauthorized super admin',
        },
      ],
    });
  }
}
