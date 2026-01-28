import { Trim } from '../../../../core/decorators/trim.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSecurityDeviceDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  ip: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  title: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  lastActiveDate: Date;
  @Trim()
  @IsNotEmpty()
  @IsString()
  expiresAt: Date;
}
