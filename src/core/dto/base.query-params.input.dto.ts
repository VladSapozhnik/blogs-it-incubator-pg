import { Transform, Type } from 'class-transformer';
import { IsEnum } from 'class-validator';

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC',
}

export class BaseQueryParams {
  @Type(() => Number)
  pageNumber: number = 1;
  @Type(() => Number)
  pageSize: number = 10;
  @Type(() => String)
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.toUpperCase()
      : SortDirection.Desc.toUpperCase(),
  )
  @IsEnum(SortDirection)
  sortDirection: SortDirection = SortDirection.Desc;

  calculateSkip(): number {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
