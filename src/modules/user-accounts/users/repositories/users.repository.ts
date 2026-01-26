import { HttpStatus, Injectable } from '@nestjs/common';
import {
  User,
  UserDocument,
  type UserModelType,
} from '../entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { Types } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly UserModel: UserModelType,
  ) {}

  async getUserById(id: string): Promise<UserDocument> {
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

    return user;
  }

  async findByLoginOrEmail(login: string, email: string) {
    const existUser: UserDocument | null = await this.UserModel.findOne({
      $or: [{ login }, { email }],
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

  async createUser(user: UserDocument): Promise<string> {
    const result: UserDocument = await user.save();
    return result._id.toString();
  }

  async removeUser(user: UserDocument) {
    await user.deleteOne();
  }
}
