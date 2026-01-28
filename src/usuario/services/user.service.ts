import { UserRepository } from '../repository/user.repository';
import { User } from '../models/user.model';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new Error('Usuário não encontrado');
    return user;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) throw new Error('Usuário não encontrado');
    return user;
  }

  async createUser(user: User): Promise<User> {
    const existingUser = await this.userRepository.findByUsername(user.username);
    if (existingUser) throw new Error('Username já existe');
    return await this.userRepository.create(user);
  }

  async updateUser(user: User): Promise<User> {
    const existingUser = await this.userRepository.findById(user.id);
    if (!existingUser) throw new Error('Usuário não encontrado');
    return await this.userRepository.update(user);
  }

  async deleteUser(id: number): Promise<void> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) throw new Error('Usuário não encontrado');
    await this.userRepository.delete(id);
  }
}