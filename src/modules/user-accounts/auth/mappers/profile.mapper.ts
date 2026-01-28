import { User } from '../../users/entities/user.entity';

export class ProfileMapper {
  userId: string;
  login: string;
  email: string;
  static mapToView(this: void, user: User): ProfileMapper {
    const dto = new ProfileMapper();

    dto.userId = user.id;
    dto.login = user.login;
    dto.email = user.email;

    return dto;
  }
}
