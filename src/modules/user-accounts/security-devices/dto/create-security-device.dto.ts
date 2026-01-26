import { Trim } from '../../../../core/decorators/trim.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSecurityDeviceDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  userId: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  deviceId: string;
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
