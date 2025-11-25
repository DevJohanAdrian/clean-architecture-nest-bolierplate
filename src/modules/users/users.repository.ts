import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>
  ) {}

  create(data: Partial<User>) {
    return this.repo.create(data);
    
  }

  save(user: User) {
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email }, relations: ['refreshTokens'] });
  }

  async findById(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['refreshTokens'] });
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
