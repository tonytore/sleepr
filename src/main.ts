import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.listen(process.env.PORT || 4000).catch((err) => console.log(err));
}

void bootstrap();
