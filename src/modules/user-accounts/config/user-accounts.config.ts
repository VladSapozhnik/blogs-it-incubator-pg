import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { configValidationUtility } from '../../../setup/config-validation.utility';

export enum Environments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TESTING = 'testing',
}

@Injectable()
export class UserAccountsConfig {
  @IsNotEmpty({ message: 'Set Env variable JWT_SECRET_KEY' })
  jwt_secret: string;
  //     #ключ для подписи токена
  @IsNotEmpty({ message: 'Set Env variable JWT_REFRESH_SECRET_KEY' })
  jwtRefreshSecret: string;
  // # жизнь токена
  @IsNotEmpty({ message: 'Set Env variable ACCESS_TOKEN_EXPIRE_IN' })
  @IsString()
  accessTokenExpires: string;
  // # жизнь refresh токена
  @IsNotEmpty({ message: 'Set Env variable REFRESH_TOKEN_EXPIRE_IN' })
  @IsString()
  refreshTokenExpires: string;
  // # опасные настройки, если true, то все зарегистрированные пользователи будут автоматически подтверждены; для production FALSE
  @IsBoolean({
    message:
      'Set Env variable IS_USER_AUTOMATICALLY_CONFIRMED, available values: true, false, 0, 1',
  })
  isUserConfirm: boolean;
  // # почта пользователя который отправляет письма
  @IsNotEmpty({ message: 'Set env variable USER_GMAIL' })
  userGmail: string;
  // # пароль пользователя который отправляет письма
  @IsNotEmpty({ message: 'Set env variable USER_GMAIL_PASSWORD' })
  userGmailPassword: string;

  constructor(private configService: ConfigService) {
    this.jwt_secret = this.configService.get('JWT_SECRET_KEY') as string;

    this.jwtRefreshSecret = this.configService.get(
      'JWT_REFRESH_SECRET_KEY',
    ) as string;

    this.accessTokenExpires = this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRE_IN',
    ) as string;

    this.refreshTokenExpires = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRE_IN',
    ) as string;

    this.isUserConfirm = configValidationUtility.convertToBoolean(
      this.configService.get('IS_USER_AUTOMATICALLY_CONFIRMED') as string,
    ) as boolean;

    this.userGmail = this.configService.get('USER_GMAIL') as string;

    this.userGmailPassword = this.configService.get(
      'USER_GMAIL_PASSWORD',
    ) as string;

    configValidationUtility.validateConfig(this);
  }
}
