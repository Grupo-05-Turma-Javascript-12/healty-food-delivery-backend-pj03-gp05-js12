import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Bcrypt {
  hashPassword(senha: string) {
    throw new Error('Method not implemented.');
  }
  private readonly saltRounds = 10;

  async encodePass(senha: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(senha, salt);
  }

  async comparePass(senha: string, hashedPass: string): Promise<boolean> {
    return bcrypt.compare(senha, hashedPass);
  }
}
