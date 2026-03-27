import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PlayerAnswersMapper } from '../../mappers/player-answers.mapper';
import { PlayerAnswerQueryRepository } from '../../repositories/player-answer.query.repository';

export class GetPlayerAnswerByIdQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetPlayerAnswerByIdQuery)
export class GetPlayerAnswerByIdQueryHandler implements IQueryHandler<GetPlayerAnswerByIdQuery> {
  constructor(
    private readonly playerAnswerQueryRepository: PlayerAnswerQueryRepository,
  ) {}

  async execute({
    id,
  }: GetPlayerAnswerByIdQuery): Promise<PlayerAnswersMapper> {
    return this.playerAnswerQueryRepository.getPlayerAnswerById(id);
  }
}
