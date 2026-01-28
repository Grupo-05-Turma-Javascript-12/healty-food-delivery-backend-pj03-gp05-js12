import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, LessThanOrEqual, Repository } from 'typeorm';
import { Produto } from '../entities/produto.entity';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
  ) {}

  async getAllProducts(): Promise<Produto[]> {
    return this.produtoRepository.find({
      relations: {
        categoria: true,
      },
    });
  }

  async getProductById(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: { id },
      relations: {
        categoria: true,
      },
    });
    if (!produto) {
      throw new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND);
    }
    return produto;
  }

  async getProductByPrice(preco: number): Promise<Produto[]> {
    return await this.produtoRepository.find({
      where: { preco: LessThanOrEqual(preco) }
    });
  }

  async createProduct(produto: Produto): Promise<Produto> {
    return this.produtoRepository.save(produto);
  }

  async updateProduct(produto: Produto): Promise<Produto> {
    await this.getProductById(produto.id);
    return await this.produtoRepository.save(produto);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.getProductById(id);
    await this.produtoRepository.delete(id);
  }
}
