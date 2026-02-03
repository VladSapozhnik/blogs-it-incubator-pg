import { BaseQueryParams } from '../../../../core/dto/base.query-params.input.dto';
import { PostSortFieldEnum } from '../enums/post-sort-field.enum';

export class GetPostsQueryParamsDto extends BaseQueryParams {
  sortBy: PostSortFieldEnum = PostSortFieldEnum.CreatedAt;
}
