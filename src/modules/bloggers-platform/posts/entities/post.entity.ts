import { CreatePostDto } from '../dto/create-post.dto';
import { CreatePostForBlogDto } from '../dto/create-post-for-blog.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

export class Post {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  likesCount: number;
  dislikesCount: number;
  blogId: string;
  blogName: string;
  createdAt: Date;
  updatedAt: Date;

  static createInstance(dto: CreatePostDto, blogName: string) {
    const post = new this();

    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;
    post.blogName = blogName;

    return post;
  }

  static createInstancePostForBlog(
    dto: CreatePostForBlogDto,
    blogName: string,
    blogId: string,
  ) {
    const post = new this();

    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = blogId;
    post.blogName = blogName;

    return post;
  }

  updatePost(dto: UpdatePostDto, blogName: string) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogName = blogName;
  }
}
