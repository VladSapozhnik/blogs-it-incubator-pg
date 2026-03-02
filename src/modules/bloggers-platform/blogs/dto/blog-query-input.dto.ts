import { BlogSortFieldEnum } from '../enums/blog-sort-field.enum';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input.dto';
import { FindOptionsWhere, ILike } from 'typeorm';
import { Blog } from '../entities/blog.entity';

export class GetBlogsQueryParamsDto extends BaseQueryParams {
  sortBy: BlogSortFieldEnum = BlogSortFieldEnum.CreatedAt;
  searchNameTerm: string | null = null;
  buildBlogsFilter() {
    const filters: FindOptionsWhere<Blog>[] = [];

    if (this.searchNameTerm) {
      filters.push({ name: ILike(`%${this.searchNameTerm}%`) });
    }

    return filters.length ? filters : {};
  }
}
