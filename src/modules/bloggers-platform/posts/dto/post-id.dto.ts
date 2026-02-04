import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class PostIdDto {
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  postId: string;
}
