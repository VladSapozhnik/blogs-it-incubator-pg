import { BlogSortFieldEnum } from '../enums/blog-sort-field.enum';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input.dto';

export class GetBlogsQueryParamsDto extends BaseQueryParams {
  sortBy: BlogSortFieldEnum = BlogSortFieldEnum.CreatedAt;
  searchNameTerm: string | null = null;
  buildBlogsFilter() {
    const filter: Record<string, any> = {};

    if (this.searchNameTerm) {
      filter.name = { $regex: this.searchNameTerm, $options: 'i' };
    }

    return filter;
  }
}
