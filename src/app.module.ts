import { configModule } from './dynamic-config-module';
import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerModule } from '@nestjs/throttler';
import { CoreModule } from './core/core.module';
import { CoreConfig } from './core/core.config';
import { TestingModule } from './modules/testing/testing.module';

@Module({
  imports: [
    configModule,
    ThrottlerModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => {
        return {
          disabled: !coreConfig.isThrottleEnabled,
          throttlers: [
            {
              ttl: coreConfig.throttleTtl,
              limit: coreConfig.throttleLimit,
            },
          ],
        };
      },
      inject: [CoreConfig],
    }),
    CqrsModule.forRoot(),
    UserAccountsModule,
    CoreModule,
    TestingModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  static forRoot(coreConfig: CoreConfig): DynamicModule {
    return {
      module: AppModule,
      imports: [...(coreConfig.includeTestingModule ? [TestingModule] : [])], // Add dynamic modules here
    };
  }
}
