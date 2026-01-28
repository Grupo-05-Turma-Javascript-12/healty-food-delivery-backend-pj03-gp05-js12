import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('NutriBox - Delivery de comida saudável')
  .setDescription(
    'Projeto de API do grupo 05 da turma JS12 do Bootcamp de desenvolvimento fullstack typescript da Generation Brasil',
  )
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
  process.env.TZ = '-03:00';
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
