import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../../usuario/services/user.service';
import { Bcrypt } from '../bcrypt/bcrypt';
import { UserLogin } from '../entities/userlogin.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsuarioService,
    private jwtService: JwtService,
    private bcrypt: Bcrypt,
  ) {}

  async validateUser(usuario: string, senha: string): Promise<any> {
    const user = await this.userService.findByUser(usuario);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const matchPassword = await this.bcrypt.comparePass(senha, user.senha);
    if (user && matchPassword) {
      const { senha, ...result } = user;
      return result;
    }
    return null;
  }

  async login(userLogin: UserLogin) {
    const payload = { sub: userLogin.usuario };

    const user = await this.userService.findByUser(userLogin.usuario);

    return {
      id: user?.id,
      nome: user?.nome,
      usuario: user?.usuario,
      senha: '',
      foto: user?.foto,
      token: `Bearer ${this.jwtService.sign(payload)}`,
    };
  }
}
