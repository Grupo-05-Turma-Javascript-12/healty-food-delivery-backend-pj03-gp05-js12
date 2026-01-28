import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from '../entities/categoria.entity';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async getAllCategories(): Promise<Categoria[]> {
    return this.categoriaRepository.find();
  }

  async getCategoryById(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({ where: { id } });
    if (!categoria) {
      throw new NotFoundException(`Categoria com id ${id} não encontrada`);
    }
    return categoria;
  }

  async createCategory(categoria: Categoria): Promise<Categoria> {
    return this.categoriaRepository.save(categoria);
  }

  async updateCategory(categoria: Categoria): Promise<Categoria> {
    await this.getCategoryById(categoria.id);
    return this.categoriaRepository.save(categoria);
  }

  async deleteCategory(id: number): Promise<void> {
    await this.getCategoryById(id);
    await this.categoriaRepository.delete(id);
  }
}
