import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Produto } from '../../produto/entities/produto.entity';

@Entity({ name: 'tb_categorias' })
export class Categoria {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  @ApiProperty()
  nome: string;

  @Column({ length: 500, nullable: true })
  @ApiProperty()
  descricao: string;

  @OneToMany(() => Produto, (produto) => produto.categoria)
  @ApiProperty({ type: () => Produto, isArray: true })
  produtos: Produto[];
}
