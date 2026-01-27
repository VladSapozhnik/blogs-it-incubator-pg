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

const useCases = [
  // RegistrationUseCase,
  // LoginUseCase,
  // ConfirmEmailUseCase,
  // NewPasswordUseCase,
  // PasswordRecoveryUseCase,
  // ResendEmailUseCase,
  // RefreshTokenUseCase,
  // RemoveDeviceSessionUseCase,
  // RemoveOtherDeviceSessionUseCase,
  // GetDeviceSessionByUserIdQueryHandler,
  // LogoutUseCase,
  CreateUserUseCase,
  RemoveUserUseCase,
  GetUsersQueryHandler,
  GetUserByIdQueryHandler,
];

@Module({
  imports: [JwtModule.register({}), PassportModule],
  controllers: [
    UsersController,
    // , AuthController, SecurityDevicesController
  ],
  providers: [
    UserAccountsConfig,
    ...useCases,
    UsersService,
    UsersRepository,
    UsersExternalRepository,
    UsersQueryRepository,
    UsersQueryExternalRepository,
    // AuthService,
    // PasswordRecoveryExternalRepository,
    // EmailAdapter,
    HashAdapter,
    // JwtAdapter,
    // CookieAdapter,
    // JwtStrategy,
    // JwtRefreshStrategy,
    SuperAdminStrategy,
    // SecurityDevicesRepository,
    // SecurityDevicesQueryRepository,
    // SecurityDevicesService,
  ],
  exports: [UsersExternalRepository],
})
export class UserAccountsModule {}
