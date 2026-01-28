import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EmailConfirmation, User } from '../entities/user.entity';
import { RegistrationDto } from '../../auth/dto/registration.dto';

@Injectable()
export class UsersExternalRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async registration(
    dto: RegistrationDto,
    hash: string,
    emailConfirmation: EmailConfirmation,
  ): Promise<string> {
    const [user]: User[] = await this.dataSource.query(
      `INSERT INTO public.users(login, email, password, "confirmationCode", "isConfirmed", "expirationDate") VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`,
      [
        dto.login,
        dto.email,
        hash,
        emailConfirmation.confirmationCode,
        emailConfirmation.isConfirmed,
        emailConfirmation.expirationDate,
      ],
    );

    if (!user) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'User already exists',
            field: 'email',
          },
        ],
      });
    }

    return user.id;
  }

  async getUserByLoginOrEmail(login: string, email: string) {
    const [existUser]: User[] = await this.dataSource.query(
      'SELECT * FROM public.users WHERE login = $1 OR email = $2',
      [login, email],
    );

    return existUser;
  }

  async findUserByCode(code: string): Promise<User> {
    const [user]: User[] = await this.dataSource.query(
      `SELECT * FROM users WHERE "confirmationCode" = $1;`,
      [code],
    );

    if (!user) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Invalid confirmation code',
            field: 'code',
          },
        ],
      });
    }

    return user;
  }

  async getUserById(id: string) {
    const [user]: User[] = await this.dataSource.query(
      `SELECT * FROM users WHERE id = $1`,
      [id],
    );

    return user;
  }

  async findUserByEmail(email: string) {
    const [existUser]: User[] = await this.dataSource.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
    );

    if (!existUser) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Input incorrect email',
            field: 'email',
          },
        ],
      });
    }

    return existUser;
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    const [existUser]: User[] = await this.dataSource.query(
      `SELECT * FROM users WHERE login = $1 OR email = $1;`,
      [loginOrEmail],
    );

    if (!existUser) {
      throw new DomainException({
        status: HttpStatus.UNAUTHORIZED,
        errorsMessages: [
          {
            message: 'Invalid login or password',
            field: 'loginOrEmail',
          },
        ],
      });
    }

    return existUser;
  }

  async confirmEmail(code: string): Promise<string> {
    const [user]: User[] = await this.dataSource.query(
      `UPDATE public.users SET "isConfirmed" = true WHERE "confirmationCode" = $1 RETURNING id;`,
      [code],
    );

    if (!user) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          { message: 'Invalid confirmation code', field: 'code' },
        ],
      });
    }

    return user.id;
  }

  async resendEmail(
    id: string,
    code: string,
    expirationDate: Date,
  ): Promise<string> {
    const [user]: User[] = await this.dataSource.query(
      `UPDATE public.users SET "confirmationCode" = $1 AND "expirationDate" = $2 WHERE id = $3 RETURNING id;`,
      [code, expirationDate, id],
    );

    return user.id;
  }

  async updatePassword(id: string, password: string) {
    const [user]: User[] = await this.dataSource.query(
      `UPDATE public.users SET password = $1 WHERE id = $2 RETURNING id`,
      [password, id],
    );

    return user.id;
  }
}
