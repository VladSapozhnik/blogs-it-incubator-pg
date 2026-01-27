import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersExternalRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getUserByLoginOrEmail(login: string, email: string) {
    const [existUser]: User[] = await this.dataSource.query(
      'SELECT * FROM public.users WHERE login = $1 OR email = $2',
      [login, email],
    );

    return existUser;
  }

  async findUserByCode(code: string) {
    const [user]: User[] = await this.dataSource.query(
      `SELECT * FROM users WHERE "confirmationCode" = $1;`,
      [code],
    );

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

  async removeUser(id: string) {
    await this.dataSource.query(`DELETE FROM public.users WHERE id = $1;`, [
      id,
    ]);
  }
}
