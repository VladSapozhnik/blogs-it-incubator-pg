import { IsOptional } from 'class-validator';

import { BaseQueryParams } from '../../../../core/dto/base.query-params.input.dto';
import { UserGameHistorySortFieldEnum } from '../enums/user-game-history-sort-field.enum';

export class UserGameHistoryQueryInputDto extends BaseQueryParams {
  @IsOptional()
  sortBy: UserGameHistorySortFieldEnum;
}
