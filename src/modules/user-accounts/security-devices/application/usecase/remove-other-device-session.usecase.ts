import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtPayload } from '../../../../../core/types/jwt-payload.type';
import { SecurityDevicesRepository } from '../../repositories/security-devices.repository';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { HttpStatus } from '@nestjs/common';

export class RemoveOtherDeviceSessionCommand {
  constructor(public readonly payload: JwtPayload) {}
}

@CommandHandler(RemoveOtherDeviceSessionCommand)
export class RemoveOtherDeviceSessionUseCase implements ICommandHandler<RemoveOtherDeviceSessionCommand> {
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}

  async execute({ payload }: RemoveOtherDeviceSessionCommand) {
    if (!payload.deviceId) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'DeviceId session not found',
            field: 'session',
          },
        ],
      });
    }

    await this.securityDevicesRepository.removeOtherDeviceSession(
      payload.userId,
      payload.deviceId,
    );
  }
}
