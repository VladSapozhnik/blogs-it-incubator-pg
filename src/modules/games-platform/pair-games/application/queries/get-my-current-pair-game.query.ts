import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetMyCurrentPairGameQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetMyCurrentPairGameQuery)
export class GetMyCurrentPairGameQueryHandler implements IQueryHandler<GetMyCurrentPairGameQuery> {
  async execute({ userId }: GetMyCurrentPairGameQuery): Promise<void> {}
}
