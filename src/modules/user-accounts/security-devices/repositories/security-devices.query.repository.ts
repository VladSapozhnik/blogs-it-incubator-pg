import { HttpStatus, Injectable } from '@nestjs/common';
import { SecurityDevice } from '../entities/security-device.entity';
import { SecurityDevicesMapper } from '../mappers/security-devices.mapper';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SecurityDevicesQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async findDeviceSessionByUserId(
    userId: string,
  ): Promise<SecurityDevicesMapper[]> {
    const sessions: SecurityDevice[] = await this.dataSource.query(
      `SELECT * FROM security_devices WHERE "userId" = $1`,
      [userId],
    );

    if (sessions.length === 0) {
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

    return sessions.map(SecurityDevicesMapper.mapToView);
  }
}
