import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/global-exception.filter';
import { GlobalValidationPipe } from './common/pipes/global-validation.pipe';
import { corsConfig } from './config/cors.config';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(GlobalValidationPipe);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());
  app.enableCors(corsConfig);
  setupSwagger(app);

  await app.listen(configService.get("PORT"));
}

bootstrap();
