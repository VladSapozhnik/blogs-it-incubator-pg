import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim.decorator';

export class UpdateCommentDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(20, 300)
  content: string;
}
