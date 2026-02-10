export class Comment {
  id: string;
  postId: string;
  content: string;
  userId: string;
  likesCount: number;
  dislikesCount: number;
  createdAt: Date;
  updatedAt?: Date;

  // static createInstance(postId: string, content: string, userId: string) {
  //   const comment = new this();
  //
  //   comment.postId = postId;
  //   comment.content = content;
  //   comment.userId = userId;
  //
  //   return comment;
  // }
}
