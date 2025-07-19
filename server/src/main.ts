import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalValidationPipe } from './common/pipes/global-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(GlobalValidationPipe);
  app.enableCors();
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
