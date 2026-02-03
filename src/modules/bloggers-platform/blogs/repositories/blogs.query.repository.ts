import { HttpStatus, Injectable } from '@nestjs/common';
import { Blog } from '../entities/blog.entity';
import { GetBlogsQueryParamsDto } from '../dto/blog-query-input.dto';
import { BlogsMapper } from '../mappers/blogs.mapper';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view.dto';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

type BlogAndTotalCount = Blog & { total_count: string };

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async getBlogs(queryDto: GetBlogsQueryParamsDto) {
    // const filter: Record<string, any> = queryDto.buildBlogsFilter();

    const blogs: BlogAndTotalCount[] = await this.dataSource.query(
      `SELECT *, count(*) OVER() AS total_count FROM blogs WHERE ($1::text IS NULL OR name ILIKE '%' || $1 || '%') ORDER BY "${queryDto.sortBy}" "${queryDto.sortDirection.toUpperCase()}" LIMIT $2 OFFSET $3;`,
      [queryDto.searchNameTerm, queryDto.pageSize, queryDto.calculateSkip()],
    );

    const totalCount: number = Number(blogs[0]?.total_count || 0);

    const items: BlogsMapper[] = blogs.map(BlogsMapper.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: queryDto.pageNumber,
      size: queryDto.pageSize,
    });
  }

  async getBlogById(id: string): Promise<BlogsMapper> {
    const [findBlog]: Blog[] = await this.dataSource.query(
      `SELECT * FROM blogs WHERE id = $1`,
      [id],
    );

    if (!findBlog) {
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

    return BlogsMapper.mapToView(findBlog);
  }
}
