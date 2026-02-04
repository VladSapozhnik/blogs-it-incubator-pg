import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../repositories/blogs.repository';
import { Blog } from '../../entities/blog.entity';

export class RemoveBlogIdCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(RemoveBlogIdCommand)
export class RemoveBlogIdUseCase implements ICommandHandler<RemoveBlogIdCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute({ id }: RemoveBlogIdCommand): Promise<void> {
    const blog: Blog = await this.blogsRepository.getBlogById(id);

    await this.blogsRepository.removeBlogById(blog.id);
  }
}
