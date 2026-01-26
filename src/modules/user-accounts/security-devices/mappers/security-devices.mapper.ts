import { SecurityDeviceDocument } from '../entities/security-device.entity';

export class SecurityDevicesMapper {
  deviceId: string;
  ip: string;
  lastActiveDate: string;
  title: string;

  static mapToView(
    this: void,
    securityDevice: SecurityDeviceDocument,
  ): SecurityDevicesMapper {
    const dto = new SecurityDevicesMapper();

    dto.ip = securityDevice.ip;
    dto.title = securityDevice.title;
    dto.lastActiveDate = securityDevice.lastActiveDate.toISOString();
    dto.deviceId = securityDevice.deviceId;

    return dto;
  }
}
