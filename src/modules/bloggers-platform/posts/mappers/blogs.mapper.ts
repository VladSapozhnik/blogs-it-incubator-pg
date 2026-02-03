import { Post } from '../entities/post.entity';
import { ExtendedLikesInfoType } from '../../likes/mappers/like-info-for-post.mapper';

export class PostsMapper {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfoType;

  static mapToView(
    this: void,
    post: Post,
    likesInfo: ExtendedLikesInfoType,
  ): PostsMapper {
    const dto = new PostsMapper();

    dto.id = post.id;
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId.toString();
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt.toISOString();
    dto.extendedLikesInfo = likesInfo;

    return dto;
  }
}
