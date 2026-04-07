import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TopUsersQueryInputDto } from '../../dto/top-users-query-input.dto';
import { PairGamesQueryRepository } from '../../repositories/pair-games.query.repository';
import { TopUsersMapper } from '../../mappers/top-users.mapper';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view.dto';

export class GetTopUsersQuery {
  constructor(public readonly queryDto: TopUsersQueryInputDto) {}
}

@QueryHandler(GetTopUsersQuery)
export class GetTopUsersQueryHandler implements IQueryHandler<GetTopUsersQuery> {
  constructor(
    private readonly pairGamesQueryRepository: PairGamesQueryRepository,
  ) {}

  async execute({
    queryDto,
  }: GetTopUsersQuery): Promise<PaginatedViewDto<TopUsersMapper[]>> {
    try {
      const { topUsers, totalCount } =
        await this.pairGamesQueryRepository.getTopUsers(queryDto);

      const items: TopUsersMapper[] = topUsers.map(TopUsersMapper.mapToView);

      return PaginatedViewDto.mapToView({
        items,
        totalCount,
        page: queryDto.pageNumber,
        size: queryDto.pageSize,
      });
    } catch (e) {
      console.error('!!! ТЕСТЫ УПАЛИ ТУТ:', e.message);
      console.error('SQL:', e.query); // Выведет сам запрос
      console.error('PARAMETERS:', e.parameters); // Выведет параметры (status и т.д.)
      throw e; // Пробрасываем 500 дальше, чтобы тест зафиксировал падение
    }
  }
}
