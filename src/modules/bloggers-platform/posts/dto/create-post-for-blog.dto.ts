import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim.decorator';

export class CreatePostForBlogDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  title: string;
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @Trim()
  shortDescription: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  content: string;
}
