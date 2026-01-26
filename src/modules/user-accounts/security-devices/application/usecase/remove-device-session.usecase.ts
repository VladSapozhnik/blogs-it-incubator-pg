import { InjectModel } from '@nestjs/mongoose';
import {
  SecurityDevice,
  SecurityDeviceDocument,
  type SecurityDeviceModelType,
} from '../../entities/security-device.entity';
import { JwtPayload } from '../../../../../core/types/jwt-payload.type';
import { SecurityDevicesRepository } from '../../repositories/security-devices.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { HttpStatus } from '@nestjs/common';

export class RemoveDeviceSessionCommand {
  constructor(
    public readonly payload: JwtPayload,
    public readonly deviceId: string,
  ) {}
}

@CommandHandler(RemoveDeviceSessionCommand)
export class RemoveDeviceSessionUseCase implements ICommandHandler<RemoveDeviceSessionCommand> {
  constructor(
    @InjectModel(SecurityDevice.name)
    private SecurityDeviceModel: SecurityDeviceModelType,
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}

  async execute({
    payload,
    deviceId,
  }: RemoveDeviceSessionCommand): Promise<void> {
    const findDeviceId: SecurityDeviceDocument | null =
      await this.securityDevicesRepository.findDeviceSessionByDeviceId(
        deviceId,
      );

    if (!findDeviceId) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'Device session not found',
            field: 'session',
          },
        ],
      });
    }

    if (findDeviceId.userId.toString() !== payload.userId.toString()) {
      throw new DomainException({
        status: HttpStatus.FORBIDDEN,
        errorsMessages: [
          {
            message: 'Forbidden',
            field: 'session',
          },
        ],
      });
    }

    await this.securityDevicesRepository.removeDeviceSession(findDeviceId);
  }
}
