import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
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
      where: { preco: LessThanOrEqual(preco) },
    });
  }

  async getProductByStockStatus(): Promise<Produto[]> {
    const produtos = await this.produtoRepository.find({
      where: { em_estoque: true },
      relations: {
        categoria: true,
      },
    });
    if (!produtos)
      throw new HttpException(
        'Nenhum produto com estoque.',
        HttpStatus.NOT_FOUND,
      );

    return produtos;
  }

  async createProduct(produto: Produto): Promise<Produto> {
    const novoProduto = this.produtoRepository.create(produto);

    const salvo = await this.produtoRepository.save(novoProduto);

    return this.produtoRepository.findOne({
      where: { id: salvo.id },
      relations: {
        categoria: true,
        usuario: true,
      },
    }) as Promise<Produto>;
  }

  async updateProduct(produto: Produto): Promise<Produto> {
    await this.getProductById(produto.id);

    const atualizado = await this.produtoRepository.save(produto);

    return this.produtoRepository.findOne({
      where: { id: atualizado.id },
      relations: {
        categoria: true,
        usuario: true,
      },
    }) as Promise<Produto>;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.getProductById(id);
    await this.produtoRepository.delete(id);
  }
}
