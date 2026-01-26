import { UserDocument } from '../../users/entities/user.entity';

export class ProfileMapper {
  userId: string;
  login: string;
  email: string;
  static mapToView(this: void, user: UserDocument): ProfileMapper {
    const dto = new ProfileMapper();

    dto.userId = user._id.toString();
    dto.login = user.login;
    dto.email = user.email;

    return dto;
  }
}
