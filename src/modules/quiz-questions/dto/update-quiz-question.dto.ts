import { ArrayMinSize, IsArray, IsString, Length } from 'class-validator';
import { Trim, TrimArray } from '../../../core/decorators/trim.decorator';

export class UpdateQuizQuestionDto {
  @IsString()
  @Trim()
  @Length(10, 500)
  body: string;
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @TrimArray()
  correctAnswers: string[];
}
