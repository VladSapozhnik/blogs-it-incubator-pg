import { BaseQueryParams } from '../../../../core/dto/base.query-params.input.dto';
import { CommentSortFieldEnum } from '../enums/comment-sort-field.enum';
import { IsEnum, IsOptional } from 'class-validator';

export const sortByMapComment: Record<string, string> = {
  Content: 'c.content',
  UserId: 'c.userId',
  UserLogin: 'userLogin',
  CreatedAt: 'c.createdAt',
};

export class GetCommentQueryParamsDto extends BaseQueryParams {
  @IsOptional()
  @IsEnum(CommentSortFieldEnum)
  sortBy: CommentSortFieldEnum = CommentSortFieldEnum.CreatedAt;
}
