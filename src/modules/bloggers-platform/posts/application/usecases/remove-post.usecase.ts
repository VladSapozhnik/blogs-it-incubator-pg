import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsExternalRepository } from '../../repositories/posts.external.repository';
import { BlogsExternalRepository } from '../../../blogs/repositories/blogs.external.repository';

export class RemovePostCommand {
  constructor(
    public readonly blogId: string,
    public readonly postId: string,
  ) {}
}

@CommandHandler(RemovePostCommand)
export class RemovePostUseCase implements ICommandHandler<RemovePostCommand> {
  constructor(
    private readonly postsExternalRepository: PostsExternalRepository,
    private readonly blogsExternalRepository: BlogsExternalRepository,
  ) {}

  async execute({ blogId, postId }: RemovePostCommand): Promise<void> {
    await this.blogsExternalRepository.getBlogById(blogId);
    await this.postsExternalRepository.findPostById(postId);

    await this.postsExternalRepository.removePost(blogId, postId);
  }
}
