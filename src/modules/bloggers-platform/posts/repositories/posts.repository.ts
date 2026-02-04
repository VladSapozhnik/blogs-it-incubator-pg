import { Post } from '../entities/post.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { WithId } from '../../../../core/types/id.type';
import { UpdatePostDto } from '../dto/update-post.dto';
import { CreatePostDto } from '../dto/create-post.dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createPost(dto: CreatePostDto, blogName: string): Promise<string> {
    const [createdPost]: WithId[] = await this.dataSource.query(
      `INSERT INTO posts title, "shortDescription", content, "blogId", "blogName" VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
      [dto.title, dto.shortDescription, dto.content, dto.blogId, blogName],
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
      `SELECT * FROM posts WHERE postId= $1`,
      [postId],
    );

    if (!existPost) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'Post not found',
            field: 'post',
          },
        ],
      });
    }

    return existPost;
  }
}
