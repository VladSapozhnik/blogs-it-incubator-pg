import { LikeStatusEnum } from '../enums/like-status.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentLikes } from '../entities/comment-likes.entity';
import { PostLikes } from '../entities/post-likes.entity';

@Injectable()
export class LikesExternalRepository {
  constructor(
    @InjectRepository(CommentLikes)
    private readonly commentLikesRepository: Repository<CommentLikes>,
    @InjectRepository(PostLikes)
    private readonly postLikesRepository: Repository<PostLikes>,
  ) {}
  async updateCommentLikeStatus(
    userId: string,
    commentId: string,
    likeStatus: LikeStatusEnum,
  ): Promise<void> {
    await this.commentLikesRepository.upsert(
      { userId, commentId, status: likeStatus },
      [userId, commentId],
    );
  }

  async updatePostLikeStatus(
    userId: string,
    postId: string,
    likeStatus: LikeStatusEnum,
  ): Promise<void> {
    await this.postLikesRepository.upsert(
      { userId, postId, status: likeStatus },
      [userId, postId],
    );
  }
}
