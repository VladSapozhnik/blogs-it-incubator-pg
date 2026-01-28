import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/application/users.service';
import { UsersRepository } from './users/repositories/users.repository';
import { UsersQueryRepository } from './users/repositories/users.query.repository';
import { UsersExternalRepository } from './users/repositories/users.external.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SuperAdminStrategy } from './users/strategies/super-admin.strategy';
import { UsersQueryExternalRepository } from './users/repositories/users.query.external.repository';
import { UserAccountsConfig } from './config/user-accounts.config';
import { CreateUserUseCase } from './users/application/usecases/create-user.usecase';
import { RemoveUserUseCase } from './users/application/usecases/remove-user.usecase';
import { HashAdapter } from '../../core/adapters/hash.adapter';
import { GetUserByIdQueryHandler } from './users/application/queries/get-user-by-id.query';
import { GetUsersQueryHandler } from './users/application/queries/get-users.query';
import { AuthController } from './auth/auth.controller';
import { SecurityDevicesController } from './security-devices/security-devices.controller';
import { SecurityDevicesExternalRepository } from './security-devices/repositories/security-devices.external.repository';
import { SecurityDevicesRepository } from './security-devices/repositories/security-devices.repository';
import { SecurityDevicesQueryRepository } from './security-devices/repositories/security-devices.query.repository';
import { SecurityDevicesService } from './security-devices/application/security-devices.service';
import { JwtAdapter } from '../../core/adapters/jwt.adapter';
import { CookieAdapter } from '../../core/adapters/cookie.adapter';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './auth/strategies/jwt-refresh.strategy';
import { EmailAdapter } from '../../core/adapters/email.adapter';
import { AuthService } from './auth/application/auth.service';
import { PasswordRecoveryExternalRepository } from './password-recovery/password-recovery.external.repository';
import { RegistrationUseCase } from './auth/application/usecases/registration.usecase';
import { LoginUseCase } from './auth/application/usecases/login.usecase';
import { ConfirmEmailUseCase } from './auth/application/usecases/confirm-email.usecase';
import { NewPasswordUseCase } from './auth/application/usecases/new-password.usecase';
import { PasswordRecoveryUseCase } from './auth/application/usecases/password-recovery.usecase';
import { ResendEmailUseCase } from './auth/application/usecases/resend-email.usecase';
import { RefreshTokenUseCase } from './auth/application/usecases/refresh-token.usecase';
import { RemoveDeviceSessionUseCase } from './security-devices/application/usecase/remove-device-session.usecase';
import { RemoveOtherDeviceSessionUseCase } from './security-devices/application/usecase/remove-other-device-session.usecase';
import { GetDeviceSessionByUserIdQueryHandler } from './security-devices/application/queries/get-device-session-by-user-id.query';
import { LogoutUseCase } from './auth/application/usecases/logout.usecase';

const useCases = [
  RegistrationUseCase,
  LoginUseCase,
  ConfirmEmailUseCase,
  NewPasswordUseCase,
  PasswordRecoveryUseCase,
  ResendEmailUseCase,
  RefreshTokenUseCase,
  RemoveDeviceSessionUseCase,
  RemoveOtherDeviceSessionUseCase,
  GetDeviceSessionByUserIdQueryHandler,
  LogoutUseCase,
  CreateUserUseCase,
  RemoveUserUseCase,
  GetUsersQueryHandler,
  GetUserByIdQueryHandler,
];

@Module({
  imports: [JwtModule.register({}), PassportModule],
  controllers: [UsersController, AuthController, SecurityDevicesController],
  providers: [
    UserAccountsConfig,
    ...useCases,
    UsersService,
    UsersRepository,
    UsersExternalRepository,
    UsersQueryRepository,
    UsersQueryExternalRepository,
    AuthService,
    PasswordRecoveryExternalRepository,
    EmailAdapter,
    HashAdapter,
    JwtAdapter,
    CookieAdapter,
    JwtStrategy,
    JwtRefreshStrategy,
    SuperAdminStrategy,
    SecurityDevicesRepository,
    SecurityDevicesQueryRepository,
    SecurityDevicesExternalRepository,
    SecurityDevicesService,
  ],
  exports: [UsersExternalRepository],
})
export class UserAccountsModule {}
