import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SecurityDevice,
  SecurityDeviceDocument,
  type SecurityDeviceModelType,
} from '../entities/security-device.entity';
import { DeleteResult, Types, UpdateResult } from 'mongoose';
import { UpdateSecurityDeviceDto } from '../dto/update-security-device.dto';

@Injectable()
export class SecurityDevicesRepository {
  constructor(
    @InjectModel(SecurityDevice.name)
    private SecurityDeviceModel: SecurityDeviceModelType,
  ) {}

  async addDeviceSession(
    device: SecurityDeviceDocument,
  ): Promise<string | null> {
    await device.save();

    return device._id.toString();
  }

  async updateDeviceSession(
    userId: string,
    deviceId: string,
    data: UpdateSecurityDeviceDto,
  ): Promise<boolean> {
    const result: UpdateResult = await this.SecurityDeviceModel.updateOne(
      {
        userId: new Types.ObjectId(userId),
        deviceId,
      },
      { $set: data },
    );

    return result.matchedCount === 1;
  }

  async save(session: SecurityDeviceDocument): Promise<string> {
    await session.save();

    return session._id.toString();
  }

  async findDeviceSessionByUserIdAndDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<SecurityDeviceDocument | null> {
    return this.SecurityDeviceModel.findOne({
      userId: new Types.ObjectId(userId),
      deviceId,
    });
  }

  async findDeviceSessionByDeviceId(
    deviceId: string,
  ): Promise<SecurityDeviceDocument | null> {
    return this.SecurityDeviceModel.findOne({
      deviceId,
    });
  }

  async removeDeviceSession(session: SecurityDeviceDocument): Promise<string> {
    await session.deleteOne();

    return session._id.toString();
  }

  async removeOtherDeviceSession(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result: DeleteResult = await this.SecurityDeviceModel.deleteMany({
      userId: new Types.ObjectId(userId),
      deviceId: { $ne: deviceId },
    });

    return result.deletedCount > 0;
  }
}
