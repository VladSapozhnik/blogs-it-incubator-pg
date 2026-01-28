import { LoginDto } from '../../dto/login.dto';
import { User } from '../../../users/entities/user.entity';
import { randomUUID } from 'node:crypto';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { HttpStatus } from '@nestjs/common';
import { UsersExternalRepository } from '../../../users/repositories/users.external.repository';
import { JwtAdapter } from '../../../../../core/adapters/jwt.adapter';
import { HashAdapter } from '../../../../../core/adapters/hash.adapter';
import { AccessAndRefreshTokensType } from '../../types/access-and-refresh-tokens.type';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtRefreshPayload } from '../../../../../core/types/jwt-payload.type';
import { SecurityDevicesExternalRepository } from '../../../security-devices/repositories/security-devices.external.repository';

export class LoginCommand {
  constructor(
    public readonly dto: LoginDto,
    public readonly ip: string,
    public readonly title: string,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly usersExternalRepository: UsersExternalRepository,
    private readonly securityDevicesExternalRepository: SecurityDevicesExternalRepository,
    private readonly hashAdapter: HashAdapter,
    private readonly jwtAdapter: JwtAdapter,
  ) {}

  async execute({
    dto,
    ip,
    title,
  }: LoginCommand): Promise<AccessAndRefreshTokensType> {
    const user: User = await this.usersExternalRepository.findByLoginOrEmail(
      dto.loginOrEmail,
    );

    const deviceId: string = randomUUID();

    const isValidatePassword: boolean = await this.hashAdapter.compare(
      user.password,
      dto.password,
    );

    if (!isValidatePassword) {
      throw new DomainException({
        status: HttpStatus.UNAUTHORIZED,
        errorsMessages: [
          {
            message: 'Invalid login or password',
            field: 'user',
          },
        ],
      });
    }

    const accessToken: string = await this.jwtAdapter.createAccessToken(
      user.id,
    );
    const refreshToken: string = await this.jwtAdapter.createRefreshToken(
      user.id,
      deviceId,
    );

    let payload: JwtRefreshPayload;
    try {
      payload = await this.jwtAdapter.verifyRefreshToken(refreshToken);
    } catch {
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

    if (!payload.exp || !payload.userId || !payload.deviceId || !payload.iat) {
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

    const lastActiveDate = new Date(payload.iat * 1000);
    const expiresAt = new Date(payload.exp * 1000);

    await this.securityDevicesExternalRepository.addDeviceSession(
      payload.userId,
      deviceId,
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
