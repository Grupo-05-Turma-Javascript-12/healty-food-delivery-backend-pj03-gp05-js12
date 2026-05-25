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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { Produto } from '../entities/produto.entity';
import { ProdutoService } from '../services/produto.service';

@ApiTags('Produto')
@UseGuards(JwtAuthGuard)
@Controller('/produtos')
@ApiBearerAuth()
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'preco', required: false, type: Number })
  getAllProducts(@Query('preco') preco?: number): Promise<Produto[]> {
    if (preco) {
      return this.produtoService.getProductByPrice(Number(preco));
    }
    return this.produtoService.getAllProducts();
  }

  @Get('/disponiveis')
  @HttpCode(HttpStatus.OK)
  getAvailableProducts(): Promise<Produto[]> {
    return this.produtoService.getProductByStockStatus();
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
