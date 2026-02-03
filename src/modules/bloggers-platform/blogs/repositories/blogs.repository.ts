import { HttpStatus, Injectable } from '@nestjs/common';
import { Blog } from '../entities/blog.entity';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { WithId } from '../../../../core/types/id.type';
import { UpdateBlogDto } from '../dto/update-blog.dto';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getBlogById(id: string): Promise<Blog> {
    const [existBlog]: Blog[] = await this.dataSource.query(
      `SELECT * FROM blogs WHERE id = $1`,
      [id],
    );

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

    return existBlog;
  }

  async createBlog(dto: CreateBlogDto): Promise<string> {
    const [createdBlog]: WithId[] = await this.dataSource.query(
      `  INSERT INTO public.blogs(name, description, "websiteUrl")VALUES ($1, $2, $3) RETURNING id;`,
      [dto.name, dto.description, dto.websiteUrl],
    );

    if (!createdBlog) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Failed to create blog',
            field: 'blog',
          },
        ],
      });
    }

    return createdBlog.id;
  }

  async updateBlog(id: string, dto: UpdateBlogDto): Promise<string> {
    const [existBlog]: WithId[] = await this.dataSource.query(
      `UPDATE public.blogs SET name = $1, description = $2, "websiteUrl" = $3 WHERE id = $4 RETURNING id;`,
      [dto.name, dto.description, dto.websiteUrl, id],
    );

    return existBlog.id;
  }

  async removeBlogById(id: string): Promise<string> {
    const [removedBlogId]: WithId[] = await this.dataSource.query(
      `DELETE FROM blogs WHERE id = $1 RETURNING id`,
      [id],
    );

    return removedBlogId.id;
  }
}
