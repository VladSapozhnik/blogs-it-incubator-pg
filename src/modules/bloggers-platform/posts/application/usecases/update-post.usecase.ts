import { UpdatePostDto } from '../../dto/update-post.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsExternalRepository } from '../../repositories/posts.external.repository';
import { BlogsExternalRepository } from '../../../blogs/repositories/blogs.external.repository';
import { Post } from '../../entities/post.entity';

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
    await this.blogsExternalRepository.getBlogById(blogId);

    const post: Post = await this.postsExternalRepository.findPostById(postId);

    post.updatePost(dto);

    await this.postsExternalRepository.savePost(post);
  }
}
