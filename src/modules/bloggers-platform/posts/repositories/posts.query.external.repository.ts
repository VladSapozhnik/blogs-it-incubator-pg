import { Post } from '../entities/post.entity';
import { GetPostsQueryParamsDto } from '../dto/post-query-input.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

type PostAndTotalCount = Post & { total_count: string };

@Injectable()
export class PostsQueryExternalRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getPosts(queryDto: GetPostsQueryParamsDto, blogId: string) {
    // const filter: { blogId: Types.ObjectId } = {
    //   blogId: new Types.ObjectId(blogId),
    // };
    //
    // const posts: PostDocument[] = await this.PostModel.find(filter)
    //   .sort({ [queryDto.sortBy]: queryDto.sortDirection })
    //   .limit(queryDto.pageSize)
    //   .skip(queryDto.calculateSkip());
    //
    // const totalCount: number = await this.PostModel.countDocuments(filter);
    const posts: PostAndTotalCount[] = await this.dataSource.query(
      `SELECT *, count(*) OVER() AS total_count FROM posts WHERE "blogId" = $1 ORDER BY "${queryDto.sortBy}" ${queryDto.sortDirection.toUpperCase()} LIMIT $2 OFFSET $3;`,
      [blogId, queryDto.pageSize, queryDto.calculateSkip()],
    );

    const totalCount: number = Number(posts[0]?.total_count || 0);

    return {
      posts,
      totalCount,
    };
  }

  async getPostById(id: string): Promise<Post> {
    const [existPost]: Post[] = await this.dataSource.query(
      `SELECT * FROM posts WHERE id = $1`,
      [id],
    );

    if (!existPost) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'Post with id ${id} not found',
            field: 'post',
          },
        ],
      });
    }

    return existPost;
  }
}
