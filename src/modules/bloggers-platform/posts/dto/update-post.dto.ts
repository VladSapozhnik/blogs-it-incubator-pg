import { IsString, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim.decorator';

export class UpdatePostDto {
  @Trim()
  @IsString()
  @Length(1, 30)
  title: string;
  @Trim()
  @IsString()
  @Length(1, 100)
  @Trim()
  shortDescription: string;
  @Trim()
  @IsString()
  @Length(1, 1000)
  content: string;
}
