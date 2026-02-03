import { Injectable } from '@nestjs/common';
import { GetPostsQueryParamsDto } from '../dto/post-query-input.dto';
import { LikesQueryExternalService } from '../../likes/services/likes.query.external.service';
import { ExtendedLikesInfoType } from '../../likes/mappers/like-info-for-post.mapper';
import { PostsMapper } from '../mappers/blogs.mapper';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view.dto';
import { PostsQueryExternalRepository } from '../repositories/posts.query.external.repository';
import { Post } from '../entities/post.entity';
import { BlogsExternalRepository } from '../../blogs/repositories/blogs.external.repository';

@Injectable()
export class PostsQueryExternalService {
  constructor(
    private readonly postsQueryExternalRepository: PostsQueryExternalRepository,
    private readonly blogsExternalRepository: BlogsExternalRepository,
    private readonly likesQueryExternalService: LikesQueryExternalService,
  ) {}

  async getAllPostsForBlog(
    queryDto: GetPostsQueryParamsDto,
    userId: string | null,
    blogId: string,
  ): Promise<PaginatedViewDto<PostsMapper[]>> {
    await this.blogsExternalRepository.getBlogById(blogId);

    const { posts, totalCount } =
      await this.postsQueryExternalRepository.getPosts(queryDto, blogId);

    const items: PostsMapper[] = await Promise.all(
      posts.map(async (post: Post): Promise<PostsMapper> => {
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

    const post: Post = await this.postsQueryExternalRepository.getPostById(id);

    return PostsMapper.mapToView(post, likesInfo);
  }
}
