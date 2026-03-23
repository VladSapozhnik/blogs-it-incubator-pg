import { IsOptional } from 'class-validator';
import { BaseQueryParams } from '../../../core/dto/base.query-params.input.dto';
import { QuizQuestionSortFieldEnum } from '../enums/quiz-question-sort-field.enum';
import { QuestionsStatusEnum } from '../enums/questions-status.enum';

export class GetQuizQuestionQueryInputDto extends BaseQueryParams {
  @IsOptional()
  sortBy: QuizQuestionSortFieldEnum = QuizQuestionSortFieldEnum.CreatedAt;
  @IsOptional()
  bodySearchTerm: string | null = null;
  @IsOptional()
  publishedStatus: QuestionsStatusEnum = QuestionsStatusEnum.all;
  buildQuestionFilter() {}
}
