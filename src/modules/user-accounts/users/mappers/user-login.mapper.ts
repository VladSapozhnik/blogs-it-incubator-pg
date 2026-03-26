import { User } from '../entities/user.entity';

export class UserLoginMapper {
  id: string;
  login: string;

  static mapToView(this: void, user: User): UserLoginMapper {
    const dto = new UserLoginMapper();

    dto.id = user.id;
    dto.login = user.login;

    return dto;
  }
}
