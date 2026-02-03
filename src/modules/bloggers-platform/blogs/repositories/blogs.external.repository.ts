import { Blog } from '../entities/blog.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsExternalRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getBlogById(id: string): Promise<Blog> {
    const [findBlog]: Blog[] = await this.dataSource.query(
      `SELECT * FROM blogs WHERE id = $1`,
      [id],
    );

    if (!findBlog) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: "Blog doesn't exist",
            field: 'blog',
          },
        ],
      });
    }

    return findBlog;
  }
}
