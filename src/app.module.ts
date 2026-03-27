import { configModule } from './dynamic-config-module';
import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerModule } from '@nestjs/throttler';
import { CoreModule } from './core/core.module';
import { CoreConfig } from './core/core.config';
import { TestingModule } from './modules/testing/testing.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
// import { GamesPlatformModule } from './modules/games-platform/games-platform.module';

@Module({
  imports: [
    configModule,
    TypeOrmModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => ({
        type: 'postgres',
        url: coreConfig.dbUrl,
        autoLoadEntities: true,
        synchronize: true,
        // schema: 'public',
        logging: true,
        ssl:
          coreConfig.env !== 'testing'
            ? {
                rejectUnauthorized: false, // важно для Neon
              }
            : false,
      }),
      inject: [CoreConfig],
    }),
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
    BloggersPlatformModule,
    CoreModule,
    TestingModule,
    // GamesPlatformModule,
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
