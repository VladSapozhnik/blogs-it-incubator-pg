import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CommentIdDto {
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  commentId: string;
}
