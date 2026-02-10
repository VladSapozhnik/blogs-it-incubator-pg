import { BaseQueryParams } from '../../../../core/dto/base.query-params.input.dto';
import { CommentSortFieldEnum } from '../enums/comment-sort-field.enum';

export class GetCommentQueryParamsDto extends BaseQueryParams {
  sortBy: CommentSortFieldEnum = CommentSortFieldEnum.CreatedAt;
}
