import { NestFactory } from '@nestjs/core';
import { appSetup } from './setup/app.setup';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CoreConfig } from './core/core.config';
import { initAppModule } from './init-app-module';

async function bootstrap() {
  const DynamicAppModule = await initAppModule();

  const app =
    await NestFactory.create<NestExpressApplication>(DynamicAppModule);

  const coreConfig: CoreConfig = app.get<CoreConfig>(CoreConfig);

  app.set('trust proxy', true);
  app.use(cookieParser());
  app.enableCors({});

  appSetup(app);

  await app.listen(coreConfig.port);
}
bootstrap();
