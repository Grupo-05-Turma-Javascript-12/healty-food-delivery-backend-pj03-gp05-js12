import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Categoria } from '../entities/categoria.entity';
import { CategoriaService } from '../services/categoria.service';

@Controller('/categorias')
export class CategoriasController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllCategories(): Promise<Categoria[]> {
    return this.categoriaService.getAllCategories();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  getCategoryById(@Param('id', ParseIntPipe) id: number): Promise<Categoria> {
    return this.categoriaService.getCategoryById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createCategory(@Body() categoria: Categoria): Promise<Categoria> {
    return this.categoriaService.createCategory(categoria);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  updateCategory(@Body() categoria: Categoria): Promise<Categoria> {
    return this.categoriaService.updateCategory(categoria);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.deleteCategory(id);
  }
}
