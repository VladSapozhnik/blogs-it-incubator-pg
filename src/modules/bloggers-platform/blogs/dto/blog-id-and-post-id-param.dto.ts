import { IsUUID } from 'class-validator';

export class BlogIdAndPostIdParamDto {
  @IsUUID()
  blogId: string;
  @IsUUID()
  postId: string;
}
