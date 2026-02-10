import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsMapper } from '../../mappers/posts.mapper';
import { PostsQueryRepository } from '../../repositories/posts.query.repository';
import { PostWithStatusRowType } from '../../types/post-with-status-row.type';

export class GetPostByIdQuery {
  constructor(
    public readonly id: string,
    public readonly userId: string | null,
  ) {}
}

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdQueryHandler implements IQueryHandler<GetPostByIdQuery> {
  constructor(private readonly postsQueryRepository: PostsQueryRepository) {}

  async execute({ id, userId }: GetPostByIdQuery): Promise<PostsMapper> {
    const post: PostWithStatusRowType =
      await this.postsQueryRepository.getPostByIdWithStatus(id, userId);

    return PostsMapper.mapToView(post);
  }
}
