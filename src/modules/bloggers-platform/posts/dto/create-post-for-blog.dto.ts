import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim.decorator';

export class CreatePostForBlogDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  title: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Trim()
  shortDescription: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string;
}
