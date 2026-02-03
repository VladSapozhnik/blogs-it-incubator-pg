import { LikeStatusEnum } from '../enums/like-status.enum';
import { IsEnum } from 'class-validator';

export class UpdateLikeDto {
  @IsEnum(LikeStatusEnum)
  likeStatus: LikeStatusEnum;
}
