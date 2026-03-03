import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim.decorator';

export class UpdateBlogDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(1, 15)
  name: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  description: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  websiteUrl: string;
}
