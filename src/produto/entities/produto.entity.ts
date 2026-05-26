import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

import { Categoria } from '../../categoria/entities/categoria.entity';
import { Usuario } from '../../usuario/entities/user.entity';

@Entity({ name: 'tb_produtos' })
export class Produto {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @Column({ length: 255 })
  @ApiProperty()
  nome: string;

  @Column({ length: 500, nullable: true })
  @ApiProperty()
  descricao: string;

  @IsNumber()
  @Column('decimal', { precision: 10, scale: 2 })
  @ApiProperty()
  preco: number;

  @Column({ default: true })
  @ApiProperty()
  em_estoque: boolean;

  @ManyToOne(() => Categoria, (categoria) => categoria.produtos, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @ManyToOne(() => Usuario, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
