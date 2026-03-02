import { HttpStatus, Injectable } from '@nestjs/common';
import { Blog } from '../entities/blog.entity';
import { GetBlogsQueryParamsDto } from '../dto/blog-query-input.dto';
import { BlogsMapper } from '../mappers/blogs.mapper';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view.dto';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
  ) {}
  async getBlogs(
    queryDto: GetBlogsQueryParamsDto,
  ): Promise<PaginatedViewDto<BlogsMapper[]>> {
    const where: Record<string, any> = queryDto.buildBlogsFilter();

    const [blogs, totalCount] = await this.blogRepository.findAndCount({
      where,
      order: {
        [queryDto.sortBy]: queryDto.sortDirection,
      },
      take: queryDto.pageSize,
      skip: queryDto.calculateSkip(),
    });

    const items: BlogsMapper[] = blogs.map(BlogsMapper.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: queryDto.pageNumber,
      size: queryDto.pageSize,
    });
  }

  async getBlogById(id: string): Promise<BlogsMapper> {
    const existBlog: Blog | null = await this.blogRepository.findOneBy({
      id: id,
    });

    if (!existBlog) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'Blog not found',
            field: 'blog',
          },
        ],
      });
    }

    return BlogsMapper.mapToView(existBlog);
  }
}
