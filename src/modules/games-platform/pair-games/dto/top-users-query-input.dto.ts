import { IsArray, IsOptional, IsString } from 'class-validator';

import {
  BaseQueryParams,
  SortDirection,
} from '../../../../core/dto/base.query-params.input.dto';
import { Transform, TransformFnParams } from 'class-transformer';
import { TopUsersEnum } from '../enums/top-users.enum';
import { OmitType } from '@nestjs/mapped-types';

const DEFAULT_SORT: string[] = [
  `${TopUsersEnum.AvgScores} ${SortDirection.Desc}`,
  `${TopUsersEnum.SumScore} ${SortDirection.Desc}`,
];

export class TopUsersQueryInputDto extends OmitType(BaseQueryParams, [
  'sortDirection',
] as const) {
  @IsOptional()
  @Transform(({ value }: TransformFnParams): string[] => {
    if (!value) {
      return DEFAULT_SORT;
    }
    const rawValues = (
      Array.isArray(value) ? value : [String(value)]
    ) as string[];

    const filteredValues: string[] = rawValues.filter((item: string) => {
      const [field] = item.split(' ');

      return Object.values(TopUsersEnum).includes(field as TopUsersEnum);
    });

    return filteredValues.length > 0 ? filteredValues : DEFAULT_SORT;
  })
  @IsArray()
  @IsString({ each: true })
  sort: string[] = DEFAULT_SORT;

  parseSortParams() {
    return this.sort.reduce((acc, item: string) => {
      const [field, direction] = item.trim().split(/\s+/);

      const upperDir: string = direction?.toUpperCase();

      acc[field] = Object.values(SortDirection).includes(
        upperDir as SortDirection,
      )
        ? (upperDir as SortDirection)
        : SortDirection.Desc;

      return acc;
    }, {});
  }
}
