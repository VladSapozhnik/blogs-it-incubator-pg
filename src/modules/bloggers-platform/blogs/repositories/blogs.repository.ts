import { HttpStatus, Injectable } from '@nestjs/common';
import { Blog } from '../entities/blog.entity';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
  ) {}

  async saveBlog(blog: Blog): Promise<string> {
    await this.blogRepository.save(blog);

    return blog.id;
  }

  async getBlogById(id: string): Promise<Blog> {
    const existBlog: Blog | null = await this.blogRepository.findOneBy({ id });

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

  async removeBlogById(id: string): Promise<void> {
    await this.blogRepository.delete({
      id,
    });
  }
}
