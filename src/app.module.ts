import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
//import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { DevService } from './data/dev.service';
import { UsuarioModule } from './usuario/usuario.module';
import { CategoriaModule } from './categoria/categoria.module';
import { AuthModule } from './auth/auth.module';
import { ProdutoModule } from './produto/produto.module';
import { ProdService } from './data/prod.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: ProdService,
      imports: [ConfigModule]
    }),
    UsuarioModule,
    CategoriaModule,
    ProdutoModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
