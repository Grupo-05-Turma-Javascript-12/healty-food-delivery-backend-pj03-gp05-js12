import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from '../entities/produto.entity';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
  ) {}

  async getAllProducts(): Promise<Produto[]> {
    return this.produtoRepository.find();
  }

  async getProductById(id: number): Promise<Produto | null> {
    return this.produtoRepository.findOne({ where: { id } });
  }

  async createProduct(produto: Produto): Promise<Produto> {
    return this.produtoRepository.save(produto);
  }

  async updateProduct(produto: Produto): Promise<Produto> {
   await this.getProductById(produto.id);
    return await this.produtoRepository.save( produto );
  }

  async deleteProduct(id: number): Promise<void> {
    await this.getProductById(id);
    await this.produtoRepository.delete(id);
  }
}
