import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private _usernameField: string;
  private _passwordField: string;
  constructor(private readonly authService: AuthService) {
    super();
    this._usernameField = 'usuario';
    this._passwordField = 'senha';
  }

  async validate(usuario: string, senha: string): Promise<any> {
    const validateUser = await this.authService.validateUser(usuario, senha);
    if (!validateUser) {
      throw new UnauthorizedException(
        'Username or password is incorrect. Verify and try again.',
      );
    }
    return validateUser;
  }
}
