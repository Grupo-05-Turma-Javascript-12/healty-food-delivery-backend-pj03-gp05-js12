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
  UseGuards,
} from '@nestjs/common';
import { Categoria } from '../entities/categoria.entity';
import { CategoriaService } from '../services/categoria.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';

@ApiTags('Categoria')
@UseGuards(JwtAuthGuard)
@Controller('/categorias')
@ApiBearerAuth()
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
  createCategory(@Param() categoria: Categoria): Promise<Categoria> {
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