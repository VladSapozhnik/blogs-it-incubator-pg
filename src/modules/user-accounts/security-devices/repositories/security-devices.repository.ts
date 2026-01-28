import { Injectable } from '@nestjs/common';
import { SecurityDevice } from '../entities/security-device.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SecurityDevicesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async findDeviceSessionByDeviceId(
    deviceId: string,
  ): Promise<SecurityDevice | null> {
    const [device]: SecurityDevice[] = await this.dataSource.query(
      `SELECT * FROM public.security_devices WHERE "deviceId" = $1`,
      [deviceId],
    );

    return device;
  }

  async removeDeviceSession(userId: string, deviceId: string): Promise<string> {
    const [session]: SecurityDevice[] = await this.dataSource.query(
      `DELETE FROM public.security_devices WHERE "userId" = $1 AND "deviceId" = $2 RETURNING id;`,
      [userId, deviceId],
    );

    return session.id;
  }

  async removeOtherDeviceSession(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const session: SecurityDevice[] = await this.dataSource.query(
      `DELETE FROM public.security_devices WHERE "userId" = $1 AND "deviceId" <> $2 RETURNING id;`,
      [userId, deviceId],
    );

    return session.length > 0;
  }
}
