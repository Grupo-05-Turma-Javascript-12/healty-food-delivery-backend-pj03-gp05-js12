import { IsNotEmpty, IsNumber } from 'class-validator';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity({ name: 'tb_produtos' })
export class Produto {

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  nome: string;

  @ApiProperty()
  @Column({ length: 500, nullable: true })
  descricao: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  preco: number;

  @ApiProperty()
  @Column({ default: true })
  em_estoque: boolean;

  @ApiProperty({ type: () => Categoria })
  @ManyToOne(() => Categoria, (categoria) => categoria.produtos, {
    onDelete: 'SET NULL',
  })
  categoria: Categoria;

  @ApiProperty({ type: () => Usuario })
  @ManyToOne(() => Usuario, (usuario) => usuario.produtos, {
    onDelete: 'CASCADE',
  })
  usuario: Usuario;
}
