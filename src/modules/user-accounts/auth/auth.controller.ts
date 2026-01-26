import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { CookieAdapter } from '../../../core/adapters/cookie.adapter';
import { type Response, type Request } from 'express';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { RegistrationConfirmationCodeDto } from './dto/registration-confirmation-code.dto';
import { RegistrationDto } from './dto/registration.dto';
import { RegistrationEmailResendingDto } from './dto/registration-email-resending.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersQueryExternalRepository } from '../users/repositories/users.query.external.repository';
import { ProfileMapper } from './mappers/profile.mapper';
import { User } from './decorator/user.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { RegistrationCommand } from './application/usecases/registration.usecase';
import { LoginCommand } from './application/usecases/login.usecase';
import { AccessAndRefreshTokensType } from './types/access-and-refresh-tokens.type';
import { ConfirmEmailCommand } from './application/usecases/confirm-email.usecase';
import { NewPasswordCommand } from './application/usecases/new-password.usecase';
import { PasswordRecoveryCommand } from './application/usecases/password-recovery.usecase';
import { ResendEmailCommand } from './application/usecases/resend-email.usecase';
import { RefreshAuthGuard } from './guards/refresh-token.guard';
import { type JwtRefreshPayload } from '../../../core/types/jwt-payload.type';
import { RefreshTokenCommand } from './application/usecases/refresh-token.usecase';
import { AccessTokenType } from './types/access-token.type';
import { LogOutCommand } from './application/usecases/logout.usecase';
import { IpThrottlerGuard } from '../../../core/guards/Ip-throttler.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly cookieAdapter: CookieAdapter,
    private readonly userQueryExternalRepository: UsersQueryExternalRepository,
  ) {}

  @UseGuards(IpThrottlerGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ): Promise<AccessTokenType> {
    const clientIp: string = req.ip ?? 'unknown';
    const userAgentString: string = req.headers['user-agent'] ?? 'unknown';

    const { accessToken, refreshToken } = await this.commandBus.execute<
      LoginCommand,
      AccessAndRefreshTokensType
    >(new LoginCommand(loginDto, clientIp, userAgentString));

    this.cookieAdapter.setRefreshCookie(res, refreshToken);

    return {
      accessToken,
    };
  }

  @UseGuards(IpThrottlerGuard)
  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() passwordRecoveryDto: PasswordRecoveryDto) {
    await this.commandBus.execute<PasswordRecoveryCommand, void>(
      new PasswordRecoveryCommand(passwordRecoveryDto.email),
    );
  }

  @UseGuards(IpThrottlerGuard)
  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() newPasswordDto: NewPasswordDto) {
    await this.commandBus.execute<NewPasswordCommand, void>(
      new NewPasswordCommand(newPasswordDto),
    );
  }

  @UseGuards(IpThrottlerGuard)
  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body() dto: RegistrationConfirmationCodeDto) {
    await this.commandBus.execute<ConfirmEmailCommand, void>(
      new ConfirmEmailCommand(dto.code),
    );
  }

  @UseGuards(IpThrottlerGuard)
  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(@Body() registrationDto: RegistrationDto) {
    await this.commandBus.execute<RegistrationCommand, void>(
      new RegistrationCommand(registrationDto),
    );
  }

  @UseGuards(IpThrottlerGuard)
  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() registrationEmailResendingDto: RegistrationEmailResendingDto,
  ) {
    await this.commandBus.execute<ResendEmailCommand, void>(
      new ResendEmailCommand(registrationEmailResendingDto.email),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async profile(@User('userId') userId: string): Promise<ProfileMapper> {
    return this.userQueryExternalRepository.getProfile(userId);
  }

  @UseGuards(RefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @User()
    user: JwtRefreshPayload,
  ): Promise<AccessTokenType> {
    const clientIp: string = req.ip ?? 'unknown';
    const userAgentString: string = req.headers['user-agent'] ?? 'unknown';

    const { accessToken, refreshToken } = await this.commandBus.execute<
      RefreshTokenCommand,
      AccessAndRefreshTokensType
    >(new RefreshTokenCommand(user, clientIp, userAgentString));

    this.cookieAdapter.setRefreshCookie(res, refreshToken);

    return {
      accessToken,
    };
  }

  @UseGuards(RefreshAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@User() user: JwtRefreshPayload): Promise<void> {
    await this.commandBus.execute(new LogOutCommand(user));
  }
}
