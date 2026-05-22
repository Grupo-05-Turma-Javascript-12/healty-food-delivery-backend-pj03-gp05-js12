import './tracer';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

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

bootstrap();
