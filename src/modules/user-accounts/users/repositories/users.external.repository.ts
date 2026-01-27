import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersExternalRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getUserByLoginOrEmail(login: string, email: string) {
    // return  await this.dataSource.query(``);
    // return this.UserModel.findOne({ $or: [{ login }, { email }] });
  }

  async findUserByCode(code: string) {
    // return this.UserModel.findOne({
    //   'emailConfirmation.confirmationCode': code,
    // });
  }

  async getUserById(id: string) {
    // return this.UserModel.findOne({
    //   _id: new Types.ObjectId(id),
    // });
  }

  async findUserByEmail(email: string) {
    // const user: UserDocument | null = await this.UserModel.findOne({
    //   email,
    // });
    //
    // if (!user) {
    //   throw new DomainException({
    //     status: HttpStatus.BAD_REQUEST,
    //     errorsMessages: [
    //       {
    //         message: 'Input incorrect email',
    //         field: 'email',
    //       },
    //     ],
    //   });
    // }
    //
    // return user;
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    // const existUser: UserDocument | null = await this.UserModel.findOne({
    //   $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    // });
    //
    // if (!existUser) {
    //   throw new DomainException({
    //     status: HttpStatus.UNAUTHORIZED,
    //     errorsMessages: [
    //       {
    //         message: 'Invalid login or password',
    //         field: 'loginOrEmail',
    //       },
    //     ],
    //   });
    // }
    //
    // return existUser;
  }

  // async save(user: UserDocument): Promise<string> {
  //   await user.save();
  //   return user._id.toString();
  // }

  async removeUser(id: string) {
    await this.dataSource.query(`DELETE FROM public.users WHERE id = $1;`, [
      id,
    ]);
  }
}
