import { IsString, MinLength } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim.decorator';

export class SendNextAnswerDto {
  @IsString()
  @Trim()
  @MinLength(1)
  answer: string;
}
