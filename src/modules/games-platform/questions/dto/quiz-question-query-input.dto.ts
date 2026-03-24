import { IsOptional } from 'class-validator';
import { QuizQuestionSortFieldEnum } from '../enums/quiz-question-sort-field.enum';
import { QuestionsStatusEnum } from '../enums/questions-status.enum';
import { FindOptionsWhere, ILike } from 'typeorm';
import { QuizQuestion } from '../entities/quiz-question.entity';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input.dto';

export class GetQuizQuestionQueryInputDto extends BaseQueryParams {
  @IsOptional()
  sortBy: QuizQuestionSortFieldEnum = QuizQuestionSortFieldEnum.CreatedAt;
  @IsOptional()
  bodySearchTerm: string | null = null;
  @IsOptional()
  publishedStatus: QuestionsStatusEnum = QuestionsStatusEnum.all;
  buildQuestionFilter() {
    const filters: FindOptionsWhere<QuizQuestion>[] = [];

    if (this.bodySearchTerm) {
      filters.push({ body: ILike(`%${this.bodySearchTerm}%`) });
    }

    if (this.publishedStatus === QuestionsStatusEnum.published) {
      filters.push({ published: true });
    }

    if (this.publishedStatus === QuestionsStatusEnum.notPublished) {
      filters.push({ published: false });
    }

    return filters.length ? filters : {};
  }
}
