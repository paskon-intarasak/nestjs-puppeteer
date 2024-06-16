import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule, {
    cors: true,
    rawBody: true,
  });

  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('example browser')
    .setDescription('')
    .setVersion('1.0')
    .addTag('')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get<number>('APP_PORT'));
  logger.log(`NODE Environtment is : ${configService.get<string>('NODE_ENV')}`);
  logger.log(`Application Name: ${configService.get<string>('APP_NAME')}`);
  logger.log(
    `Application listening on PORT:${configService.get<number>('APP_PORT')}`,
  );
}
bootstrap();
