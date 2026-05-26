import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Categoria } from '../../categoria/entities/categoria.entity';
import { Usuario } from '../../usuario/entities/user.entity';

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
  @IsOptional()
  @Column({ length: 500, nullable: true })
  descricao: string;

  @ApiProperty()
  @IsNumber()
  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  preco: number;

  @ApiProperty()
  @IsBoolean()
  @Column({ default: true })
  em_estoque: boolean;

  @ApiProperty({ type: () => Categoria })
  @IsOptional()
  @ValidateNested()
  @Type(() => Categoria)
  @ManyToOne(() => Categoria, (categoria) => categoria.produtos, {
    onDelete: 'SET NULL',
  })
  categoria: Categoria;

  @ApiProperty({ type: () => Usuario })
  @IsOptional()
  @ValidateNested()
  @Type(() => Usuario)
  @ManyToOne(() => Usuario, (usuario) => usuario.produtos, {
    onDelete: 'CASCADE',
  })
  usuario: Usuario;
}
