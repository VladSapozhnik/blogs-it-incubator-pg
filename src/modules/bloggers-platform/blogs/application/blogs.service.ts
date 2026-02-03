import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../repositories/blogs.repository';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { CreateBlogDto } from '../dto/create-blog.dto';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async createBlog(dto: CreateBlogDto): Promise<string> {
    return await this.blogsRepository.createBlog(dto);
  }

  async updateBlog(id: string, dto: UpdateBlogDto): Promise<void> {
    await this.blogsRepository.getBlogById(id);

    await this.blogsRepository.updateBlog(id, dto);
  }

  async removeBlogById(id: string): Promise<void> {
    await this.blogsRepository.getBlogById(id);

    await this.blogsRepository.removeBlogById(id);
  }
}
