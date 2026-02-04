import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsMapper } from '../../mappers/blogs.mapper';
import { ExtendedLikesInfoType } from '../../../likes/mappers/like-info-for-post.mapper';
import { Post } from '../../entities/post.entity';
import { PostsQueryRepository } from '../../repositories/posts.query.repository';
import { LikesQueryExternalService } from '../../../likes/application/likes.query.external.service';

export class GetPostByIdQuery {
  constructor(
    public readonly id: string,
    public readonly userId: string | null,
  ) {}
}

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdQueryHandler implements IQueryHandler<GetPostByIdQuery> {
  constructor(
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly likesQueryExternalService: LikesQueryExternalService,
  ) {}

  async execute({ id, userId }: GetPostByIdQuery): Promise<PostsMapper> {
    const likesInfo: ExtendedLikesInfoType =
      await this.likesQueryExternalService.likesInfoForPosts(id, userId);

    const post: Post = await this.postsQueryRepository.getPostById(id);

    return PostsMapper.mapToView(post, likesInfo);
  }
}
