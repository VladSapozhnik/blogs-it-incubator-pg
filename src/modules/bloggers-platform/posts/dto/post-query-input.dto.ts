import { BaseQueryParams } from '../../../../core/dto/base.query-params.input.dto';
import { PostSortFieldEnum } from '../enums/post-sort-field.enum';
import { IsEnum, IsOptional } from 'class-validator';

export const sortByMapPosts: Record<string, string> = {
  createdAt: 'p.createdAt',
  title: 'p.title',
  shortDescription: 'p.shortDescription',
  content: 'p.content',
  blogName: 'b.name',
};

export class GetPostsQueryParamsDto extends BaseQueryParams {
  @IsOptional()
  @IsEnum(PostSortFieldEnum)
  sortBy: PostSortFieldEnum = PostSortFieldEnum.CreatedAt;
}
