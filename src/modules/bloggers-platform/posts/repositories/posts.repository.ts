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
  async updatePost(
    id: string,
    dto: UpdatePostDto,
    blogName: string,
  ): Promise<string> {
    const [updatedPostId]: WithId[] = await this.dataSource.query(
      `UPDATE public.posts SET title = $1, "shortDescription" = $2, content=$3, "blogName" = $4 WHERE id = $5 AND "blogId" = $6 RETURNING id;`,
      [dto.title, dto.shortDescription, dto.content, blogName, id, dto.blogId],
    );

    if (!updatedPostId) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'Failed to update Post',
            field: 'post',
          },
        ],
      });
    }

    return updatedPostId.id;
  }

  async removePost(id: string): Promise<string> {
    const [removedPostId]: WithId[] = await this.dataSource.query(
      `DELETE FROM posts WHERE id = $1 RETURNING id;`,
      [id],
    );

    if (!removedPostId) {
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

    return removedPostId.id;
  }
}
