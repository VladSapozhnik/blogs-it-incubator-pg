import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetSecurityDeviceByUserIdQuery } from './application/queries/get-device-session-by-user-id.query';
import { RemoveOtherDeviceSessionCommand } from './application/usecase/remove-other-device-session.usecase';
import { RemoveDeviceSessionCommand } from './application/usecase/remove-device-session.usecase';
import { User } from '../auth/decorator/user.decorator';
import { type JwtPayload } from '../../../core/types/jwt-payload.type';
import { RefreshAuthGuard } from '../auth/guards/refresh-token.guard';
import { SecurityDevicesMapper } from './mappers/security-devices.mapper';

@UseGuards(RefreshAuthGuard)
@Controller('security/devices')
export class SecurityDevicesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  getUserDevices(@User() user: JwtPayload): Promise<SecurityDevicesMapper[]> {
    return this.queryBus.execute<
      GetSecurityDeviceByUserIdQuery,
      SecurityDevicesMapper[]
    >(new GetSecurityDeviceByUserIdQuery(user.userId));
  }

  @Delete(':deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeDeviceSession(
    @User() user: JwtPayload,
    @Param('deviceId') deviceId: string,
  ) {
    return this.commandBus.execute<RemoveDeviceSessionCommand, void>(
      new RemoveDeviceSessionCommand(user, deviceId),
    );
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  removeOtherSessions(@User() user: JwtPayload) {
    return this.commandBus.execute<RemoveOtherDeviceSessionCommand, void>(
      new RemoveOtherDeviceSessionCommand(user),
    );
  }
}
