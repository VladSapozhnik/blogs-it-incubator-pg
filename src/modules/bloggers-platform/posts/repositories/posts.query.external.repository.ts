import { Post } from '../entities/post.entity';
import { GetPostsQueryParamsDto } from '../dto/post-query-input.dto';
import { Injectable } from '@nestjs/common';
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
}
