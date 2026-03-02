import { Post } from '../entities/post.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class PostsExternalRepository {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}
  async savePost(post: Post): Promise<string> {
    await this.postRepository.save(post);
    return post.id;
  }

  async findPostById(postId: string): Promise<Post> {
    const existPost: Post | null = await this.postRepository.findOneBy({
      id: postId,
    });

    if (!existPost) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'Not found post',
            field: 'post',
          },
        ],
      });
    }

    return existPost;
  }

  async removePost(blogId: string, postId: string): Promise<void> {
    const result: DeleteResult = await this.postRepository.delete({
      blogId,
      id: postId,
    });

    if (!result.affected) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'Failed to remove Post',
            field: 'post',
          },
        ],
      });
    }
  }
}
