import { HttpStatus, Injectable } from '@nestjs/common';
import { ProfileMapper } from '../../auth/mappers/profile.mapper';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLoginMapper } from '../mappers/user-login.mapper';

@Injectable()
export class UsersQueryExternalRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getProfile(id: string): Promise<ProfileMapper> {
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

    return ProfileMapper.mapToView(user);
  }

  async getUserLogin(id: string): Promise<UserLoginMapper | null> {
    const user: User | null = await this.userRepository.findOneBy({ id });

    return user ? UserLoginMapper.mapToView(user) : null;
  }
}
