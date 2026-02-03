import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim.decorator';

export class CreatePostDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  title: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  shortDescription: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string;
  @Trim()
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  blogId: string;
}
