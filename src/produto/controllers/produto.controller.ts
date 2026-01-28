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
import { Produto } from '../entities/produto.entity';
import { ProdutoService } from '../services/produto.service';

@Controller('/produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllProducts(): Promise<Produto[]> {
    return this.produtoService.getAllProducts();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  getProductById(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
    return this.produtoService.getProductById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createProduct(@Body() produto: Produto): Promise<Produto> {
    return this.produtoService.createProduct(produto);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  updateProduct(@Body() produto: Produto): Promise<Produto> {
    return this.produtoService.updateProduct(produto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.produtoService.deleteProduct(id);
  }
}
