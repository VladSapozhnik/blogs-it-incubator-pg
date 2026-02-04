import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DeviceIdDto {
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  deviceId: string;
}
