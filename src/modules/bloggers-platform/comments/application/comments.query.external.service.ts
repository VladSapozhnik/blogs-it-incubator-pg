import { Injectable } from '@nestjs/common';
import { CommentsMapper } from '../mappers/comments.mapper';
import { CommentsQueryExternalRepository } from '../repositories/comments.query.external.repository';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view.dto';
import { GetCommentQueryParamsDto } from '../dto/comment-query-input.dto';
import { PostsExternalRepository } from '../../posts/repositories/posts.external.repository';
import { CommentWithStatusRowType } from '../types/comment-with-status-row.type';

@Injectable()
export class CommentsQueryExternalService {
  constructor(
    private readonly commentsQueryExternalRepository: CommentsQueryExternalRepository,
    private readonly postsExternalRepository: PostsExternalRepository,
  ) {}

  async getCommentsByPostId(
    queryDto: GetCommentQueryParamsDto,
    postId: string,
    userId: string | null,
  ): Promise<PaginatedViewDto<CommentsMapper[]>> {
    await this.postsExternalRepository.findPostById(postId);

    const { comments, totalCount } =
      await this.commentsQueryExternalRepository.getCommentsWithStatus(
        queryDto,
        postId,
        userId,
      );

    const items: CommentsMapper[] = comments.map(CommentsMapper.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: queryDto.pageNumber,
      size: queryDto.pageSize,
    });
  }

  async getCommentById(
    commentId: string,
    userId: string | null = null,
  ): Promise<CommentsMapper> {
    const comment: CommentWithStatusRowType =
      await this.commentsQueryExternalRepository.getCommentAndUserLikeStatus(
        commentId,
        userId,
      );

    return CommentsMapper.mapToView(comment);
  }
}
