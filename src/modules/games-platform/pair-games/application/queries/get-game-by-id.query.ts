import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetGameByIdQuery {
  constructor(
    public readonly userId: string,
    public readonly id: string,
  ) {}
}

@QueryHandler(GetGameByIdQuery)
export class GetGameByIdQueryHandler implements IQueryHandler<GetGameByIdQuery> {
  async execute({ userId, id }: GetGameByIdQuery): Promise<void> {}
}
