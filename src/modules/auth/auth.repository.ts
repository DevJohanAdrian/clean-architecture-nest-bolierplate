import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/index';

@Injectable()
export class Authrepository {
  constructor(@InjectRepository(RefreshToken) private rtRepo: Repository<RefreshToken>) {}

  async create(data: Partial<RefreshToken>) {
    return this.rtRepo.create(data);
  }

  async save(data: RefreshToken) {
    return this.rtRepo.save(data);
  }

  async find(userId: string) {
    return this.rtRepo.find({ where: { user: { id: userId } }, relations: ['user'] });
  }

  async remove(token){
   return  await this.rtRepo.remove(token);
  }

  async delete(userId:string){
     await this.rtRepo.delete({ user: { id: userId } } as { user: { id: string } });
  }
}
