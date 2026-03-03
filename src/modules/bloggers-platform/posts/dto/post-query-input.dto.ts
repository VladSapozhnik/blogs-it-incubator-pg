import { BaseQueryParams } from '../../../../core/dto/base.query-params.input.dto';
import { PostSortFieldEnum } from '../enums/post-sort-field.enum';
import { IsOptional } from 'class-validator';

export class GetPostsQueryParamsDto extends BaseQueryParams {
  @IsOptional()
  sortBy: PostSortFieldEnum = PostSortFieldEnum.CreatedAt;
}
