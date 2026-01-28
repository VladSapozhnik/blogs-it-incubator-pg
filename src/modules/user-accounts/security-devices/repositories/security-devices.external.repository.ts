import { Injectable } from '@nestjs/common';
import { SecurityDevice } from '../entities/security-device.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SecurityDevicesExternalRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async addDeviceSession(
    userId: string,
    deviceId: string,
    ip: string,
    title: string,
    lastActiveDate: Date,
    expiresAt: Date,
  ): Promise<string | null> {
    const [device]: SecurityDevice[] = await this.dataSource.query(
      `INSERT INTO public.security_devices("userId", "deviceId", ip, title, "lastActiveDate", "expiresAt") VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`,
      [userId, deviceId, ip, title, lastActiveDate, expiresAt],
    );

    return device.id;
  }

  async findDeviceSessionByUserIdAndDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<SecurityDevice | null> {
    const [session]: SecurityDevice[] = await this.dataSource.query(
      `SELECT * FROM public.security_devices WHERE "userId" = $1 AND "deviceId" = $2`,
      [userId, deviceId],
    );

    return session;
  }

  async removeDeviceSession(userId: string, deviceId: string): Promise<string> {
    const [session]: SecurityDevice[] = await this.dataSource.query(
      `DELETE FROM public.security_devices WHERE "userId" = $1 AND "deviceId" = $2" RETURNING id;`,
      [userId, deviceId],
    );

    return session.id;
  }

  async updateSession(
    id: string,
    ip: string,
    title: string,
    lastActiveDate: Date,
    expiresAt: Date,
  ): Promise<void> {
    await this.dataSource.query(
      `UPDATE public.security_devices SET ip = $1, title = $2, "lastActiveDate" = $3, "expiresAt" = $4 WHERE id = $5 RETURNING id`,
      [ip, title, lastActiveDate, expiresAt, id],
    );
  }
}
