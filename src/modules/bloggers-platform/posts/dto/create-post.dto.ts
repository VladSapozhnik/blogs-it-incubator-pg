import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim.decorator';

export class CreatePostDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  title: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  shortDescription: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  content: string;
  @Trim()
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  blogId: string;
}
