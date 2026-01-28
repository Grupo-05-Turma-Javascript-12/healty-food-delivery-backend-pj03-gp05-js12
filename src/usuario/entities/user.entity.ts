import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Produto } from '../../produtos/entities/produto.entity';

@Entity({ name: 'tb_usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  @ApiProperty()
  nome: string;

  @IsEmail()
  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  @ApiProperty()
  usuario: string;

  @MinLength(8)
  @IsNotEmpty()
  @Column({ length: 150, nullable: false })
  @ApiProperty()
  senha: string;

  @IsNotEmpty()
  @Column({ length: 5000, nullable: false })
  @ApiProperty()
  foto: string;

  @CreateDateColumn({ name: 'data_cadastro', type: 'date' })
  @ApiProperty()
  dataCadastro: Date;

  @OneToMany(() => Produto, (produto) => produto.usuario)
  @ApiProperty({ type: () => Produto, isArray: true })
  produtos: Produto[];
}
