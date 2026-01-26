import { Response } from 'supertest';
import { PaginatedViewDto } from '../../src/core/dto/base.paginated.view.dto';

export function getAllForPaginationHelper<T>(
  response: Response,
  page: number = 1,
  pageSize: number = 10,
) {
  const body = response.body as PaginatedViewDto<T[]>;

  const items: T[] = body.items;

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const pageItems =
    Array.isArray(items) && startIndex < items.length
      ? items.slice(startIndex, endIndex)
      : [];

  return {
    pagesCount: Math.ceil(items.length / pageSize),
    page: page,
    pageSize: pageSize,
    totalCount: items.length,
    items: pageItems,
  };
}
