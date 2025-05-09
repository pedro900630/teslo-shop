import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(envs.port);
  console.log(`Application is running on port ${envs.port}`);
}
bootstrap();
// Compare this snippet from src/config/envs.ts:
