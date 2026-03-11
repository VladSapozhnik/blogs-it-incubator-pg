import { BaseQueryParams } from '../../../../core/dto/base.query-params.input.dto';
import { CommentSortFieldEnum } from '../enums/comment-sort-field.enum';
import { IsEnum, IsOptional } from 'class-validator';

export const sortByMapComment: Record<string, string> = {
  content: 'c.content',
  userId: 'c.userId',
  userLogin: 'userLogin',
  createdAt: 'c.createdAt',
};

export class GetCommentQueryParamsDto extends BaseQueryParams {
  @IsOptional()
  @IsEnum(CommentSortFieldEnum)
  sortBy: CommentSortFieldEnum = CommentSortFieldEnum.CreatedAt;
}
