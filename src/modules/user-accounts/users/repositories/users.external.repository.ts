import { HttpStatus, Injectable } from '@nestjs/common';
import {
  User,
  UserDocument,
  type UserModelType,
} from '../entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class UsersExternalRepository {
  constructor(
    @InjectModel(User.name) private readonly UserModel: UserModelType,
  ) {}

  async getUserByLoginOrEmail(login: string, email: string) {
    return this.UserModel.findOne({ $or: [{ login }, { email }] });
  }

  async findUserByCode(code: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      _id: new Types.ObjectId(id),
    });
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    const user: UserDocument | null = await this.UserModel.findOne({
      email,
    });

    if (!user) {
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

    return user;
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument> {
    const existUser: UserDocument | null = await this.UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
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

  async save(user: UserDocument): Promise<string> {
    await user.save();
    return user._id.toString();
  }

  async removeUser(user: UserDocument) {
    await user.deleteOne();
  }
}
