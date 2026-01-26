import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  type UserModelType,
  UserDocument,
} from '../entities/user.entity';
import { GetUsersQueryParamsDto } from '../dto/users-query-input.dto';
import { UsersMapper } from '../mappers/users.mapper';
import { HttpStatus } from '@nestjs/common';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view.dto';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { Types } from 'mongoose';

export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name) private readonly UserModel: UserModelType,
  ) {}
  async getAllUsers(queryDto: GetUsersQueryParamsDto) {
    const filter = queryDto.buildUserFilter();

    const users: UserDocument[] = await this.UserModel.find(filter)
      .sort({ [queryDto.sortBy]: queryDto.sortDirection, _id: 1 })
      .skip(queryDto.calculateSkip())
      .limit(queryDto.pageSize);

    const totalCount: number = await this.UserModel.countDocuments(filter);

    const items: UsersMapper[] = users.map(UsersMapper.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: queryDto.pageNumber,
      size: queryDto.pageSize,
    });
  }

  async getUserById(id: string): Promise<UsersMapper> {
    const user: UserDocument | null = await this.UserModel.findOne({
      _id: new Types.ObjectId(id),
    });

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

    return UsersMapper.mapToView(user);
  }
}
