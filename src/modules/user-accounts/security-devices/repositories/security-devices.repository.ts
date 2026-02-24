import { Injectable } from '@nestjs/common';
import { SecurityDevice } from '../entities/security-device.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Not, Repository } from 'typeorm';

@Injectable()
export class SecurityDevicesRepository {
  constructor(
    @InjectRepository(SecurityDevice)
    private readonly securityDeviceRepository: Repository<SecurityDevice>,
  ) {}
  async findDeviceSessionByDeviceId(
    deviceId: string,
  ): Promise<SecurityDevice | null> {
    return this.securityDeviceRepository.findOneBy({ deviceId });
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

  async removeOtherDeviceSession(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result: DeleteResult = await this.securityDeviceRepository.delete({
      userId,
      deviceId: Not(deviceId),
    });

    return (result.affected ?? 0) > 0;
  }
}
