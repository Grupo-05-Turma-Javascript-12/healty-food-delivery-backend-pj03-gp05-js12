import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';
import { Usuario } from '../entities/user.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly bcrypt: Bcrypt,
  ) {}

  async findByUser(usuario: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({
      where: {
        usuario: usuario,
      },
    });
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async findById(id: number): Promise<Usuario> {
    const usuarioExistente = await this.usuarioRepository.findOneBy({ id });
    if (!usuarioExistente) {
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
    }
    return usuarioExistente;
  }

  async createUser(usuario: Usuario): Promise<Usuario> {
    const usuarioExistente = await this.findByUser(usuario.usuario);
    if (usuarioExistente) {
      throw new HttpException('Usuário já existente.', HttpStatus.BAD_REQUEST);
    }
    usuario.senha = await this.bcrypt.encodePass(usuario.senha);
    return this.usuarioRepository.save(usuario);
  }

  async update(usuario: Usuario): Promise<Usuario> {
    await this.findById(usuario.id);
    const usuarioExistente = await this.findByUser(usuario.usuario);
    if (usuarioExistente && usuarioExistente.id !== usuario.id) {
      throw new HttpException('Usuário já existente!', HttpStatus.BAD_REQUEST);
    }
    usuario.senha = await this.bcrypt.encodePass(usuario.senha);
    return this.usuarioRepository.save(usuario);
  }
}
