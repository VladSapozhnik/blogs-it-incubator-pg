import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getUserById(id: string): Promise<User> {
    const [user]: User[] = await this.dataSource.query(
      `SELECT * FROM users WHERE id = $1`,
      [id],
    );

    if (!user) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'User not found',
            field: 'id',
          },
        ],
      });
    }

    return user;
  }

  async findByLoginOrEmail(login: string, email: string) {
    const [existUser]: User[] = await this.dataSource.query(
      'SELECT * FROM public.users WHERE login = $1 OR email = $2',
      [login, email],
    );

    if (existUser) {
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
  }

  async createUser(dto: CreateUserDto): Promise<string> {
    const [user]: User[] = await this.dataSource.query(
      `INSERT INTO users(login, email, password) VALUES ($1, $2, $3) RETURNING id`,
      [dto.login, dto.email, dto.password],
    );

    return user.id;
  }

  async removeUser(id: string): Promise<void> {
    await this.dataSource.query(`DELETE FROM public.users WHERE id = $1;`, [
      id,
    ]);
  }
}
