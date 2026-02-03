import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim.decorator';

export class UpdatePostDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  title: string;
  @Trim()
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
  @Trim()
  @IsNotEmpty()
  @IsString()
  blogId: string;
}
