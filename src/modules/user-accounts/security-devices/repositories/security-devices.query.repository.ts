import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SecurityDevice,
  SecurityDeviceDocument,
  type SecurityDeviceModelType,
} from '../entities/security-device.entity';
import { Types } from 'mongoose';
import { SecurityDevicesMapper } from '../mappers/security-devices.mapper';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class SecurityDevicesQueryRepository {
  constructor(
    @InjectModel(SecurityDevice.name)
    private SecurityDeviceModel: SecurityDeviceModelType,
  ) {}
  async findDeviceSessionByUserId(
    userId: string,
  ): Promise<SecurityDevicesMapper[]> {
    const session: SecurityDeviceDocument[] | null =
      await this.SecurityDeviceModel.find({
        userId: new Types.ObjectId(userId),
      });

    if (!session) {
      throw new DomainException({
        status: HttpStatus.UNAUTHORIZED,
        errorsMessages: [
          {
            message: 'Unauthorized',
            field: 'session',
          },
        ],
      });
    }

    return session.map(SecurityDevicesMapper.mapToView);
  }
}
