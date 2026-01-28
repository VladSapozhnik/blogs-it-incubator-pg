import { JwtAdapter } from '../../../../../core/adapters/jwt.adapter';
import { AccessAndRefreshTokensType } from '../../types/access-and-refresh-tokens.type';
import { JwtRefreshPayload } from '../../../../../core/types/jwt-payload.type';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityDevice } from '../../../security-devices/entities/security-device.entity';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { HttpStatus } from '@nestjs/common';
import { SecurityDevicesExternalRepository } from '../../../security-devices/repositories/security-devices.external.repository';

export class RefreshTokenCommand {
  constructor(
    public readonly oldPayload: JwtRefreshPayload,
    public readonly ip: string,
    public readonly title: string,
  ) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase implements ICommandHandler<
  RefreshTokenCommand,
  AccessAndRefreshTokensType
> {
  constructor(
    private readonly securityDevicesExternalRepository: SecurityDevicesExternalRepository,
    readonly jwtAdapter: JwtAdapter,
  ) {}

  async execute({
    oldPayload,
    ip,
    title,
  }: RefreshTokenCommand): Promise<AccessAndRefreshTokensType> {
    const isActiveSession: SecurityDevice | null =
      await this.securityDevicesExternalRepository.findDeviceSessionByUserIdAndDeviceId(
        oldPayload.userId,
        oldPayload.deviceId,
      );

    if (
      !isActiveSession ||
      Math.floor(isActiveSession.lastActiveDate.getTime() / 1000) !==
        oldPayload.iat
    ) {
      throw new DomainException({
        status: HttpStatus.UNAUTHORIZED,
        errorsMessages: [
          {
            message: 'Unauthorized',
            field: 'refreshToken',
          },
        ],
      });
    }

    const accessToken: string = await this.jwtAdapter.createAccessToken(
      oldPayload.userId,
    );
    const refreshToken: string = await this.jwtAdapter.createRefreshToken(
      oldPayload.userId,
      oldPayload.deviceId,
    );

    const newPayload: JwtRefreshPayload =
      await this.jwtAdapter.verifyRefreshToken(refreshToken);

    const lastActiveDate = new Date(newPayload.iat * 1000);
    const expiresAt = new Date(newPayload.exp * 1000);

    await this.securityDevicesExternalRepository.updateSession(
      isActiveSession.id,
      ip,
      title,
      lastActiveDate,
      expiresAt,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
