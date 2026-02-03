import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim.decorator';

export class UpdateBlogDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  name: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  websiteUrl: string;
}
