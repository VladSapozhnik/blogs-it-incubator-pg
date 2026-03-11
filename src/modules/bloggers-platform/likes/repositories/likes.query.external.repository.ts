import { CommentLikes } from '../entities/comment-likes.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostLikes } from '../entities/post-likes.entity';

@Injectable()
export class LikesQueryExternalRepository {
  constructor(
    @InjectRepository(CommentLikes)
    private readonly commentLikesRepository: Repository<CommentLikes>,
    @InjectRepository(PostLikes)
    private readonly postLikesRepository: Repository<PostLikes>,
  ) {}

  async getMyStatusLikeForComment(
    commentId: string,
    userId: string,
  ): Promise<CommentLikes | null> {
    const commentLike: CommentLikes | null =
      await this.commentLikesRepository.findOneBy({
        commentId,
        userId,
      });

    if (!commentLike?.status) {
      return null;
    }

    return commentLike;
  }

  async getMyStatusLikeForPost(
    postId: string,
    userId: string,
  ): Promise<PostLikes | null> {
    const postLike: PostLikes | null = await this.postLikesRepository.findOneBy(
      { postId, userId },
    );

    if (!postLike?.status) {
      return null;
    }

    return postLike;
  }
}
