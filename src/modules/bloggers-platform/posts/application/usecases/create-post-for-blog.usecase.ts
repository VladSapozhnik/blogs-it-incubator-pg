import { CreatePostForBlogDto } from '../../dto/create-post-for-blog.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Blog } from '../../../blogs/entities/blog.entity';
import { PostsExternalRepository } from '../../repositories/posts.external.repository';
import { BlogsExternalRepository } from '../../../blogs/repositories/blogs.external.repository';

export class CreatePostForBlogCommand {
  constructor(
    public readonly dto: CreatePostForBlogDto,
    public readonly blogId: string,
  ) {}
}

@CommandHandler(CreatePostForBlogCommand)
export class CreatePostForBlogUseCase implements ICommandHandler<CreatePostForBlogCommand> {
  constructor(
    private readonly postsExternalRepository: PostsExternalRepository,
    private readonly blogsExternalRepository: BlogsExternalRepository,
  ) {}

  async execute({ dto, blogId }: CreatePostForBlogCommand): Promise<string> {
    const blog: Blog = await this.blogsExternalRepository.getBlogById(blogId);

    return await this.postsExternalRepository.createPost(
      dto,
      blog.name,
      blogId,
    );
  }
}
