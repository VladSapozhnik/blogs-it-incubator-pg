import { Blog } from '../entities/blog.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BlogsExternalRepository {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
  ) {}

  async getBlogById(id: string): Promise<Blog> {
    const existBlog: Blog | null = await this.blogRepository.findOneBy({ id });

    if (!existBlog) {
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

    return existBlog;
  }
}
