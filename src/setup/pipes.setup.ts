import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { DomainException } from '../core/exceptions/domain-exceptions';
import { DomainHttpExceptionsFilter } from '../core/exceptions/filters/domain-exceptions.filter';

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      // whitelist: true,
      // forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const errorsMessages = errors.map((err) => ({
          field: err.property,
          message: Object.values(err.constraints || {})[0],
        }));

        return new DomainException({
          status: HttpStatus.BAD_REQUEST,
          errorsMessages,
        });
      },
    }),
  );

  app.useGlobalFilters(new DomainHttpExceptionsFilter());
}
