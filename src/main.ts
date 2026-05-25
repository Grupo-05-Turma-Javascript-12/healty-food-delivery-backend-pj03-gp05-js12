import './tracer';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
      originAgentCluster: false,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const logger = app.get<typeof console>(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggingInterceptor(app.get('winston')));

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Healthy Food API')
    .setDescription('API REST para delivery de comida saudavel')
    .setContact(
      'Grupo 05 - Andreza Luiza, Beatriz Monteiro, Cesar Souza, João Henrique, Josenil Soares, Raylander Ribeiro, Stephanie Mayara',
      'https://github.com/Grupo-05-Turma-Javascript-12',
      'generationjs12gp05@gmail.com',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  await app.listen(process.env.PORT ?? 4000);
  console.log(`API:     http://localhost:${process.env.PORT ?? 4000}`);
  console.log(`Swagger: http://localhost:${process.env.PORT ?? 4000}/swagger`);
  console.log(`Health:  http://localhost:${process.env.PORT ?? 4000}/health`);
}

void bootstrap();
