import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Blog } from '../../blogs/entities/blog.entity';
import { PostsRepository } from '../repositories/posts.repository';
import { BlogsExternalRepository } from '../../blogs/repositories/blogs.external.repository';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly blogsExternalRepository: BlogsExternalRepository,
  ) {}

  async createPost(dto: CreatePostDto): Promise<string> {
    const blog: Blog = await this.blogsExternalRepository.getBlogById(
      dto.blogId,
    );

    return await this.postsRepository.createPost(dto, blog.name);
  }
}
