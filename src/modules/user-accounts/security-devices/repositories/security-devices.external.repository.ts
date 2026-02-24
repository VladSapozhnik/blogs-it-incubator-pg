import { Injectable } from '@nestjs/common';
import { SecurityDevice } from '../entities/security-device.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class SecurityDevicesExternalRepository {
  constructor(
    @InjectRepository(SecurityDevice)
    private readonly securityDeviceRepository: Repository<SecurityDevice>,
  ) {}
  async saveDeviceSession(securityDevice: SecurityDevice): Promise<string> {
    await this.securityDeviceRepository.save(securityDevice);

    return securityDevice.id;
  }

  async findDeviceSessionByUserIdAndDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<SecurityDevice | null> {
    return this.securityDeviceRepository.findOne({
      where: { userId, deviceId },
    });
  }

  async removeDeviceSession(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result: DeleteResult = await this.securityDeviceRepository.delete({
      userId,
      deviceId,
    });

    return (result.affected ?? 0) > 0;
  }
}
