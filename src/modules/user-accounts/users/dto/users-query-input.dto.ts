import { UserSortFieldEnum } from '../enums/user-sort-field.enum';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input.dto';
import { FindOptionsWhere, ILike } from 'typeorm';
import { User } from '../entities/user.entity';

export class GetUsersQueryParamsDto extends BaseQueryParams {
  sortBy: UserSortFieldEnum = UserSortFieldEnum.CreatedAt;
  searchLoginTerm: string | null = null;
  searchEmailTerm: string | null = null;

  buildUserFilter() {
    const filters: FindOptionsWhere<User>[] = [];

    if (this.searchLoginTerm) {
      filters.push({ login: ILike(`%${this.searchLoginTerm}%`) });
    }
    if (this.searchEmailTerm)
      filters.push({ email: ILike(`%${this.searchEmailTerm}%`) });

    return filters.length ? filters : {};
  }
}
