import { Post } from '../entities/post.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { WithId } from '../../../../core/types/id.type';
import { CreatePostForBlogDto } from '../dto/create-post-for-blog.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsExternalRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createPost(
    dto: CreatePostForBlogDto,
    blogName: string,
    blogId: string,
  ): Promise<string> {
    const [createdPost]: WithId[] = await this.dataSource.query(
      `INSERT INTO posts (title, "shortDescription", content, "blogId", "blogName") VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
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

  async updatePost(
    blogId: string,
    postId: string,
    blogName: string,
    dto: UpdatePostDto,
  ): Promise<string> {
    const [updatedPostId]: WithId[] = await this.dataSource.query(
      `UPDATE public.posts SET title = $1, "shortDescription" = $2, content=$3, "blogName" = $4 WHERE id = $5 AND "blogId" = $6 RETURNING id;`,
      [dto.title, dto.shortDescription, dto.content, blogName, postId, blogId],
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

  async removePost(blogId: string, postId: string): Promise<string> {
    const [removedPostId]: WithId[] = await this.dataSource.query(
      `DELETE FROM posts WHERE id = $1 AND "blogId" = $2 RETURNING id;`,
      [postId, blogId],
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
