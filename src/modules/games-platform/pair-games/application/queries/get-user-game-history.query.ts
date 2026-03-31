import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { UserGameHistoryQueryInputDto } from '../../dto/user-game-history-query-input.dto';
import { PairGamesQueryRepository } from '../../repositories/pair-games.query.repository';
import { PairGame } from '../../entities/pair-game.entity';
import { PlayerAnswerQueryRepository } from '../../repositories/player-answer.query.repository';
import { PlayerAnswer } from '../../entities/player-answer.entity';
import { PlayerProgressQueryRepository } from '../../repositories/player-progress.query.repository';
import { PlayerProgress } from '../../entities/player-progress.entity';
import { QuizQuestionQueryExternalRepository } from '../../../questions/repositories/quiz-question.query.external.repository';
import { QuizQuestion } from '../../../questions/entities/quiz-question.entity';
import { UsersQueryExternalRepository } from '../../../../user-accounts/users/repositories/users.query.external.repository';
import { PairGameMapper } from '../../mappers/pair-game.mapper';
import { UserLoginMapper } from '../../../../user-accounts/users/mappers/user-login.mapper';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view.dto';

export class GetUserGameHistoryQuery {
  constructor(
    public readonly userId: string,
    public readonly queryDto: UserGameHistoryQueryInputDto,
  ) {}
}

@QueryHandler(GetUserGameHistoryQuery)
export class GetUserGameHistoryQueryHandler implements ICommandHandler<GetUserGameHistoryQuery> {
  constructor(
    private readonly pairGameQueryRepository: PairGamesQueryRepository,
    private readonly playerAnswerQueryRepository: PlayerAnswerQueryRepository,
    private readonly playerProgressesQueryRepository: PlayerProgressQueryRepository,
    private readonly quizQuestionQueryExternalRepository: QuizQuestionQueryExternalRepository,
    private readonly usersQueryExternalRepository: UsersQueryExternalRepository,
  ) {}

  async execute({ userId, queryDto }: GetUserGameHistoryQuery) {
    const [games, totalCount] =
      await this.pairGameQueryRepository.getUserGameHistoryAndTotal(
        userId,
        queryDto,
      );

    const gameIds: string[] = games.map((game: PairGame) => game.id);

    const answers: PlayerAnswer[] =
      await this.playerAnswerQueryRepository.getAnswersByIds(gameIds);

    const progresses: PlayerProgress[] =
      await this.playerProgressesQueryRepository.getPlayerProgressByIds(
        gameIds,
      );

    const userIds: string[] = [
      ...new Set(
        games
          .flatMap((g) => [g.firstPlayerId, g.secondPlayerId])
          .filter((id): id is string => id !== null),
      ),
    ];

    const users: UserLoginMapper[] =
      await this.usersQueryExternalRepository.getUsersLoginById(userIds);

    const questionIds: string[] = [
      ...new Set(games.flatMap((g) => g.questionsIds)),
    ];

    const questions: QuizQuestion[] =
      await this.quizQuestionQueryExternalRepository.getQuestionsByIds(
        questionIds,
      );

    const items: PairGameMapper[] = games.map((game) => {
      const gameQuestions = questions.filter((q) =>
        game.questionsIds.includes(q.id),
      );

      const firstAnswers = answers.filter(
        (a) => a.gameId === game.id && a.playerId === game.firstPlayerId,
      );
      const secondAnswers = game.secondPlayerId
        ? answers.filter(
            (a) => a.gameId === game.id && a.playerId === game.secondPlayerId,
          )
        : [];

      const firstProgress = progresses.find(
        (p) => p.gameId === game.id && p.playerId === game.firstPlayerId,
      );
      const secondProgress = game.secondPlayerId
        ? progresses.find(
            (p) => p.gameId === game.id && p.playerId === game.secondPlayerId,
          )
        : null;

      const firstUser = users.find((u) => u.id === game.firstPlayerId)!;
      const secondUser = game.secondPlayerId
        ? users.find((u) => u.id === game.secondPlayerId)
        : null;

      return PairGameMapper.mapToView(
        game,
        gameQuestions,
        firstAnswers,
        secondAnswers,
        firstProgress?.score ?? 0,
        secondProgress?.score ?? 0,
        firstUser.login,
        secondUser?.login ?? null,
      );
    });

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: queryDto.pageNumber,
      size: queryDto.pageSize,
    });
  }
}
