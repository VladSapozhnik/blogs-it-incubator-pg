import { UserSortFieldEnum } from '../enums/user-sort-field.enum';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input.dto';

export class GetUsersQueryParamsDto extends BaseQueryParams {
  sortBy: UserSortFieldEnum = UserSortFieldEnum.CreatedAt;
  searchLoginTerm: string | null = null;
  searchEmailTerm: string | null = null;
  buildUserFilter() {
    const or: any[] = [];

    if (this.searchLoginTerm) {
      or.push({ login: { $regex: this.searchLoginTerm, $options: 'i' } });
    }
    if (this.searchEmailTerm)
      or.push({ email: { $regex: this.searchEmailTerm, $options: 'i' } });

    return or.length ? { $or: or } : {};
  }
}
