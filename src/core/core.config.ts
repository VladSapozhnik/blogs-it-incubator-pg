import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { configValidationUtility } from '../setup/config-validation.utility';

export enum Environments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TESTING = 'testing',
}

@Injectable()
export class CoreConfig {
  @IsNotEmpty({ message: 'Set Env variable DATABASE_URL' })
  dbUrl: string;

  @IsNumber({}, { message: 'Set Env variable PORT' })
  port: number;

  @IsBoolean({
    message:
      'Set Env variable INCLUDE_TESTING_MODULE, available values: true, false, 0, 1',
  })
  includeTestingModule: boolean;

  @IsEnum(Environments, {
    message:
      'Ser correct NODE_ENV value, available values: ' +
      configValidationUtility.getEnumValues(Environments).join(', '),
  })
  env: string;

  @IsBoolean({
    message:
      'Set Env variable THROTTLE_ON, available values: true, false, 0, 1',
  })
  isThrottleEnabled: boolean;
  // # время для лимита запросов
  @IsNotEmpty({ message: 'Set env variable THROTTLE_TTL' })
  @IsNumber({}, { message: 'Set env variable THROTTLE_TTL as number' })
  throttleTtl: number;
  // # количество лимит запросов
  @IsNotEmpty({ message: 'Set env variable THROTTLE_LIMIT' })
  @IsNumber({}, { message: 'Set env variable THROTTLE_LIMIT as number' })
  throttleLimit: number;

  constructor(private configService: ConfigService) {
    this.dbUrl = this.configService.get('DATABASE_URL') as string;

    this.port = Number(this.configService.get('PORT')) || 3005;

    this.includeTestingModule = configValidationUtility.convertToBoolean(
      this.configService.get('INCLUDE_TESTING_MODULE') as string,
    ) as boolean;

    this.env = this.configService.get('NODE_ENV') as string;

    this.isThrottleEnabled = configValidationUtility.convertToBoolean(
      this.configService.get('THROTTLE_ON') as string,
    ) as boolean;

    this.throttleTtl = Number(this.configService.get('THROTTLE_TTL') as string);

    this.throttleLimit = Number(
      this.configService.get('THROTTLE_LIMIT') as string,
    );

    configValidationUtility.validateConfig(this);
  }
}
