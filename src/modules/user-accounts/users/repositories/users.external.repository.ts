import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersExternalRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}
  async saveUser(user: User): Promise<string> {
    await this.userRepository.save(user);

    return user.id;
  }

  async getUserByLoginOrEmail(login: string, email: string): Promise<void> {
    const existUser: User | null = await this.userRepository.findOne({
      where: [{ login }, { email }],
    });

    if (existUser) {
      if (existUser.login === login) {
        throw new DomainException({
          status: HttpStatus.BAD_REQUEST,
          errorsMessages: [
            {
              message: 'Login already exists',
              field: 'login',
            },
          ],
        });
      } else if (existUser.email === email) {
        throw new DomainException({
          status: HttpStatus.BAD_REQUEST,
          errorsMessages: [
            {
              message: 'Email already exists',
              field: 'email',
            },
          ],
        });
      }
    }
  }

  async findUserByCode(code: string): Promise<User> {
    const user: User | null = await this.userRepository.findOneBy({
      confirmationCode: code,
    });

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

  async getUserById(id: string): Promise<User> {
    const user: User | null = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new DomainException({
        status: HttpStatus.UNAUTHORIZED,
        errorsMessages: [
          {
            message: 'Unauthorized',
            field: 'user',
          },
        ],
      });
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const existUser: User | null = await this.userRepository.findOneBy({
      email,
    });

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

  async findByLoginOrEmail(loginOrEmail: string): Promise<User> {
    const existUser: User | null = await this.userRepository.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

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
      `UPDATE public.users 
     SET "confirmationCode" = $1, "expirationDate" = $2 
     WHERE "id" = $3 
     RETURNING "id";`,
      [code, expirationDate, id],
    );

    if (!user) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'User with this email does not exist',
            field: 'email',
          },
        ],
      });
    }

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
