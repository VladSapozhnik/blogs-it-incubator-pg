import { UserDocument } from '../entities/user.entity';

export class UsersMapper {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  static mapToView(this: void, user: UserDocument): UsersMapper {
    const dto = new UsersMapper();

    dto.id = user._id.toString();
    dto.login = user.login;
    dto.email = user.email;
    dto.createdAt = user.createdAt.toISOString();

    return dto;
  }
}
