import { CreatePostForBlogDto } from '../../dto/create-post-for-blog.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsExternalRepository } from '../../repositories/posts.external.repository';
import { BlogsExternalRepository } from '../../../blogs/repositories/blogs.external.repository';
import { Post } from '../../entities/post.entity';

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
    await this.blogsExternalRepository.getBlogById(blogId);

    const post: Post = Post.createInstancePostForBlog(dto, blogId);

    return this.postsExternalRepository.savePost(post);
  }
}
