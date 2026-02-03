import { IsUUID } from 'class-validator';

export class BlogIdParamDto {
  @IsUUID()
  blogId: string;
}
