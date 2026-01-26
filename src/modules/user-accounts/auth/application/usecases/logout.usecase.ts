import { SecurityDevicesRepository } from '../../../security-devices/repositories/security-devices.repository';
import { SecurityDeviceDocument } from '../../../security-devices/entities/security-device.entity';
import { JwtRefreshPayload } from '../../../../../core/types/jwt-payload.type';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { HttpStatus } from '@nestjs/common';

export class LogOutCommand {
  constructor(public readonly payload: JwtRefreshPayload) {}
}

@CommandHandler(LogOutCommand)
export class LogoutUseCase implements ICommandHandler<LogOutCommand> {
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}

  async execute({ payload }: LogOutCommand): Promise<void> {
    const userId: string = payload.userId;
    const deviceId: string = payload.deviceId;

    const isActiveSession: SecurityDeviceDocument | null =
      await this.securityDevicesRepository.findDeviceSessionByUserIdAndDeviceId(
        userId,
        deviceId,
      );

    if (
      !isActiveSession ||
      Math.floor(isActiveSession.lastActiveDate.getTime() / 1000) !==
        payload.iat
    ) {
      throw new DomainException({
        status: HttpStatus.UNAUTHORIZED,
        errorsMessages: [
          {
            message: 'Unauthorized',
            field: 'refresh-token',
          },
        ],
      });
    }

    await this.securityDevicesRepository.removeDeviceSession(isActiveSession);
  }
}
