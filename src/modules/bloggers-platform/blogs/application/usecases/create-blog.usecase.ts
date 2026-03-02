import { CreateBlogDto } from '../../dto/create-blog.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../repositories/blogs.repository';
import { Blog } from '../../entities/blog.entity';

export class CreateBlogCommand {
  constructor(public readonly dto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}
  async execute({ dto }: CreateBlogCommand): Promise<string> {
    const blog: Blog = Blog.createInstance(dto);

    return this.blogsRepository.saveBlog(blog);
  }
}
