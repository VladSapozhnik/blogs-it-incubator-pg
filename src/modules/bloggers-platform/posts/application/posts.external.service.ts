import { Injectable } from '@nestjs/common';
import { PostsExternalRepository } from '../repositories/posts.external.repository';
import { BlogsExternalRepository } from '../../blogs/repositories/blogs.external.repository';
import { CreatePostForBlogDto } from '../dto/create-post-for-blog.dto';
import { Blog } from '../../blogs/entities/blog.entity';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsExternalService {
  constructor(
    private readonly postsExternalRepository: PostsExternalRepository,
    private readonly blogsExternalRepository: BlogsExternalRepository,
  ) {}

  async createPostForBlog(
    dto: CreatePostForBlogDto,
    blogId: string,
  ): Promise<string> {
    const blog: Blog = await this.blogsExternalRepository.getBlogById(blogId);

    return await this.postsExternalRepository.createPost(
      dto,
      blog.name,
      blogId,
    );
  }

  async updatePost(
    blogId: string,
    postId: string,
    dto: UpdatePostDto,
  ): Promise<void> {
    const blog: Blog = await this.blogsExternalRepository.getBlogById(blogId);

    await this.postsExternalRepository.findPostById(postId);

    await this.postsExternalRepository.updatePost(
      blogId,
      postId,
      blog.name,
      dto,
    );
  }

  async removePost(blogId: string, postId: string): Promise<void> {
    await this.blogsExternalRepository.getBlogById(blogId);
    await this.postsExternalRepository.findPostById(postId);

    await this.postsExternalRepository.removePost(blogId, postId);
  }
}
