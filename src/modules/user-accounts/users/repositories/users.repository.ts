import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUserById(id: string): Promise<User> {
    const user: User | null = await this.userRepository.findOneBy({ id });

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

  async assertUserNotExists(login: string, email: string) {
    const existUser: User | null = await this.userRepository.findOne({
      where: [{ email }, { login }],
    });

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

  async saveUser(user: User): Promise<string> {
    await this.userRepository.save(user);

    return user.id;
  }

  async removeUser(id: string): Promise<void> {
    await this.userRepository.delete({ id });
  }
}
