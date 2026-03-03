import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC',
}

export class BaseQueryParams {
  @IsOptional()
  @Type(() => Number)
  pageNumber: number = 1;
  @IsOptional()
  @Type(() => Number)
  pageSize: number = 10;
  @Type(() => String)
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim().toUpperCase()
      : SortDirection.Desc.toUpperCase(),
  )
  @IsEnum(SortDirection)
  sortDirection: SortDirection = SortDirection.Desc;

  calculateSkip(): number {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
