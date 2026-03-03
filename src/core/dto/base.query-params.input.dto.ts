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
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string' && value.toLowerCase() === 'asc') {
      return SortDirection.Asc;
    }
    return SortDirection.Desc;
  })
  @IsEnum(SortDirection)
  sortDirection: SortDirection = SortDirection.Desc;

  calculateSkip(): number {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
