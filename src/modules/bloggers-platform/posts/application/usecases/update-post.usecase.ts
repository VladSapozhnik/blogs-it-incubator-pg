import { UpdatePostDto } from '../../dto/update-post.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Blog } from '../../../blogs/entities/blog.entity';
import { PostsExternalRepository } from '../../repositories/posts.external.repository';
import { BlogsExternalRepository } from '../../../blogs/repositories/blogs.external.repository';

export class UpdatePostCommand {
  constructor(
    public readonly blogId: string,
    public readonly postId: string,
    public readonly dto: UpdatePostDto,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private readonly postsExternalRepository: PostsExternalRepository,
    private readonly blogsExternalRepository: BlogsExternalRepository,
  ) {}

  async execute({ blogId, postId, dto }: UpdatePostCommand): Promise<void> {
    const blog: Blog = await this.blogsExternalRepository.getBlogById(blogId);

    await this.postsExternalRepository.findPostById(postId);

    await this.postsExternalRepository.updatePost(
      blogId,
      postId,
      blog.name,
      dto,
    );
  }
}
