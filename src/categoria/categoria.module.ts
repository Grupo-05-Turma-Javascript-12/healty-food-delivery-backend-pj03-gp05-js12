import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasController } from './controllers/categoria.controller';
import { Categoria } from './entities/categoria.entity';
import { CategoriaService } from './services/categoria.service';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria])],
  providers: [CategoriaService],
  controllers: [CategoriasController],
  exports: [CategoriaService],
})
export class CategoriaModule {}
