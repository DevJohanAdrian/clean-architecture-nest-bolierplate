// import { Injectable } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// // import { UpdateUserDto } from './dto/update-user.dto';

// @Injectable()
// export class UsersService {
//   create(createUserDto: CreateUserDto) {
//     return 'This action adds a new user';
//   }

//   findAll() {
//     return `This action returns all users`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} user`;
//   }

//   // update(id: number, updateUserDto: UpdateUserDto) {
//   //   return `This action updates a #${id} user`;
//   // }

//   remove(id: number) {
//     return `This action removes a #${id} user`;
//   }
// }


import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Role } from '@src/common/enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private configService: ConfigService
  ) {}

  async createUser(data: { email: string; name: string; password: string }) {
    const saltRounds = this.configService.get<number>('BCRYPT_SALT', 10);
    const hashed = await bcrypt.hash(data.password, saltRounds);
    const user = this.repo.create({ 
      email: data.email, 
      name: data.name, 
      password: hashed, 
      roles: [Role.USER] 
    });
    return this.repo.save(user);
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email }, relations: ['refreshTokens'] });
  }

  async findById(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['refreshTokens'] });
  }

  async comparePasswords(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
  }
}
