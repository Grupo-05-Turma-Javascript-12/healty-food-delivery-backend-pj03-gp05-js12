import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { CategoriaService } from './services/categoria.service';
import { CategoriasController } from './controllers/categoria.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria])],
  providers: [CategoriaService],
  controllers: [CategoriasController],
  exports: [CategoriaService],
})
export class CategoriaModule {}
