import { UpdateBlogDto } from '../../dto/update-blog.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../repositories/blogs.repository';
import { Blog } from '../../entities/blog.entity';

export class UpdateBlogCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateBlogDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute({ id, dto }: UpdateBlogCommand): Promise<void> {
    const blog: Blog = await this.blogsRepository.getBlogById(id);

    blog.updateBlog(dto);

    await this.blogsRepository.saveBlog(blog);
  }
}
