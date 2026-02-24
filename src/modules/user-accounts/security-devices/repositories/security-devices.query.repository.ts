import { HttpStatus, Injectable } from '@nestjs/common';
import { SecurityDevice } from '../entities/security-device.entity';
import { SecurityDevicesMapper } from '../mappers/security-devices.mapper';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SecurityDevicesQueryRepository {
  constructor(
    @InjectRepository(SecurityDevice)
    private readonly securityDeviceRepository: Repository<SecurityDevice>,
  ) {}
  async findDeviceSessionByUserId(
    userId: string,
  ): Promise<SecurityDevicesMapper[]> {
    const sessions: SecurityDevice[] =
      await this.securityDeviceRepository.findBy({ userId });

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
