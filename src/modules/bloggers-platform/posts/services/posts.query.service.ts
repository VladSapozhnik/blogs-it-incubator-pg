import { Injectable } from '@nestjs/common';
import { Post } from '../entities/post.entity';
import { GetPostsQueryParamsDto } from '../dto/post-query-input.dto';
import { PostsQueryRepository } from '../repositories/posts.query.repository';
import { LikesQueryExternalService } from '../../likes/services/likes.query.external.service';
import { ExtendedLikesInfoType } from '../../likes/mappers/like-info-for-post.mapper';
import { PostsMapper } from '../mappers/blogs.mapper';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view.dto';

@Injectable()
export class PostsQueryService {
  constructor(
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly likesQueryExternalService: LikesQueryExternalService,
  ) {}

  async getPosts(
    queryDto: GetPostsQueryParamsDto,
    userId: string | null,
  ): Promise<PaginatedViewDto<PostsMapper[]>> {
    const { posts, totalCount } =
      await this.postsQueryRepository.getPosts(queryDto);

    const items: PostsMapper[] = await Promise.all(
      posts.map(async (post) => {
        const extendedLikesInfoType: ExtendedLikesInfoType =
          await this.likesQueryExternalService.likesInfoForPosts(
            post.id,
            userId,
          );

        return PostsMapper.mapToView(post, extendedLikesInfoType);
      }),
    );

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: queryDto.pageNumber,
      size: queryDto.pageSize,
    });
  }

  async getPostById(id: string, userId: string | null): Promise<PostsMapper> {
    const likesInfo: ExtendedLikesInfoType =
      await this.likesQueryExternalService.likesInfoForPosts(id, userId);

    const post: Post = await this.postsQueryRepository.getPostById(id);

    return PostsMapper.mapToView(post, likesInfo);
  }
}
