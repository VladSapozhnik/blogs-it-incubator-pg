import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogsMapper } from '../../mappers/blogs.mapper';
import { BlogsQueryRepository } from '../../repositories/blogs.query.repository';

export class GetBlogIdQuery {
  constructor(public id: string) {}
}

@QueryHandler(GetBlogIdQuery)
export class GetBlogByIdQueryHandler implements IQueryHandler<GetBlogIdQuery> {
  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}

  async execute({ id }: GetBlogIdQuery): Promise<BlogsMapper> {
    return this.blogsQueryRepository.getBlogById(id);
  }
}
