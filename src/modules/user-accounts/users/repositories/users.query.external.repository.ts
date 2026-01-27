import { HttpStatus, Injectable } from '@nestjs/common';
// import { ProfileMapper } from '../../auth/mappers/profile.mapper';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class UsersQueryExternalRepository {
  constructor() {}

  async getProfile(id: string) {
    // const user: UserDocument | null = await this.UserModel.findOne({
    //   _id: new Types.ObjectId(id),
    // });
    //
    // if (!user) {
    //   throw new DomainException({
    //     status: HttpStatus.UNAUTHORIZED,
    //     errorsMessages: [
    //       {
    //         message: 'Unauthorized',
    //         field: 'user',
    //       },
    //     ],
    //   });
    // }
    // return ProfileMapper.mapToView(user);
  }
}
