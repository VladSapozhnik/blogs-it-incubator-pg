import { Post } from '../entities/post.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { WithId } from '../../../../core/types/id.type';
import { CreatePostForBlogDto } from '../dto/create-post-for-blog.dto';

@Injectable()
export class PostsExternalRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createPost(
    dto: CreatePostForBlogDto,
    blogName: string,
    blogId: string,
  ): Promise<string> {
    const [createdPost]: WithId[] = await this.dataSource.query(
      `INSERT INTO posts title, "shortDescription", content, "blogId", "blogName" VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
      [dto.title, dto.shortDescription, dto.content, blogId, blogName],
    );

    if (!createdPost) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Failed to create Post',
            field: 'post',
          },
        ],
      });
    }

    return createdPost.id;
  }

  async findPostById(postId: string): Promise<Post> {
    const [existPost]: Post[] = await this.dataSource.query(
      `SELECT * FROM posts WHERE id = $1`,
      [postId],
    );

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
}
