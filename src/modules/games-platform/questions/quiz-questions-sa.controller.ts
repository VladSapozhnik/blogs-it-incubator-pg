import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';
import { UpdateQuizQuestionDto } from './dto/update-quiz-question.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateQuestionCommand } from './application/usecases/create-question.usecase';
import { UpdateQuestionCommand } from './application/usecases/update-question.usecase';
import { UpdatePublishCommand } from './application/usecases/update-publish.usecase';
import { UpdatePublishDto } from './dto/update-publish-quiz-question.dto';
import { RemoveQuestionCommand } from './application/usecases/remove-question.usecase';
import { GetQuestionByIdQuery } from './application/queries/get-question-by-id.query';
import { QuizQuestionMapper } from './mappers/quiz-question.mapper';
import { GetAllQuestionsQuery } from './application/queries/gel-all-questions.query';
import { GetQuizQuestionQueryInputDto } from './dto/quiz-question-query-input.dto';
import { SuperAdminAuthGuard } from '../../user-accounts/users/guards/super-admin-auth.guard';
import { WithIdDto } from '../../../core/dto/with-id.dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view.dto';

@Controller('sa/quiz/questions')
@UseGuards(SuperAdminAuthGuard)
export class QuizQuestionsSaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async GelAllQuestions(
    @Query() queryDto: GetQuizQuestionQueryInputDto,
  ): Promise<PaginatedViewDto<QuizQuestionMapper[]>> {
    return this.queryBus.execute<
      GetAllQuestionsQuery,
      PaginatedViewDto<QuizQuestionMapper[]>
    >(new GetAllQuestionsQuery(queryDto));
  }

  @Post()
  async createQuestion(@Body() createQuizQuestionDto: CreateQuizQuestionDto) {
    const id: string = await this.commandBus.execute<
      CreateQuestionCommand,
      string
    >(new CreateQuestionCommand(createQuizQuestionDto));

    return this.queryBus.execute<GetQuestionByIdQuery, QuizQuestionMapper>(
      new GetQuestionByIdQuery(id),
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateQuestion(
    @Param() params: WithIdDto,
    @Body() dto: UpdateQuizQuestionDto,
  ): Promise<void> {
    const { id } = params;
    return this.commandBus.execute<UpdateQuestionCommand, void>(
      new UpdateQuestionCommand(id, dto),
    );
  }

  @Put(':id/publish')
  @HttpCode(HttpStatus.NO_CONTENT)
  async UpdatePublish(
    @Param() params: WithIdDto,
    @Body() dto: UpdatePublishDto,
  ): Promise<void> {
    const { id } = params;
    return this.commandBus.execute<UpdatePublishCommand, void>(
      new UpdatePublishCommand(id, dto.published),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeQuestion(@Param() params: WithIdDto): Promise<void> {
    const { id } = params;

    return this.commandBus.execute<RemoveQuestionCommand, void>(
      new RemoveQuestionCommand(id),
    );
  }
}
