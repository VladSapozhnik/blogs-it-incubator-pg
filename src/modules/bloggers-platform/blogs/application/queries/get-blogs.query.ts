import { GetBlogsQueryParamsDto } from '../../dto/blog-query-input.dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view.dto';
import { BlogsMapper } from '../../mappers/blogs.mapper';
import { BlogsQueryRepository } from '../../repositories/blogs.query.repository';

export class GetBlogsQuery {
  constructor(public readonly query: GetBlogsQueryParamsDto) {}
}

@QueryHandler(GetBlogsQuery)
export class GetBlogsQueryHandler implements IQueryHandler<GetBlogsQuery> {
  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}
  async execute({
    query,
  }: GetBlogsQuery): Promise<PaginatedViewDto<BlogsMapper[]>> {
    return this.blogsQueryRepository.getBlogs(query);
  }
}
