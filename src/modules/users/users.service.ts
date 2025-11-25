import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { Role } from './entities/roles.entity';
import * as bcrypt from 'bcrypt';
import { SYSTEM_ROLES } from '@src/common/constanst/users.const';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    // @InjectRepository(User) private repo: Repository<User>,
    private readonly usersRepo: UsersRepository,
    private configService: ConfigService
  ) {}

  async createUser(data: CreateUserDto) {
    const saltRounds = this.configService.get<number>('BCRYPT_SALT', 10);
    const hashed = await bcrypt.hash(data.password, saltRounds);
    // create crea un instancia en memoria
    const user = this.usersRepo.create({
      email: data.email,
      name: data.name,
      password: hashed,
      role: { id: SYSTEM_ROLES.USER.id } as Partial<Role>
    } as Partial<User>);
    // save lo persiste en la bd (guarda)
    return this.usersRepo.save(user);
  }

  async findOne(id: string) {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  findAll() {
    return this.usersRepo.findAll();
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.findOne(id);

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    Object.assign(user, data);

    return this.usersRepo.save(user);
  }

  async findByEmail(email: string) {
    return this.usersRepo.findByEmail(email);
  }

  async findById(id: string) {
    return this.usersRepo.findById(id);
  }

  async comparePasswords(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
  }

  async remove(id: string) {
    const result = await this.usersRepo.delete(id);
    if (!result.affected) throw new NotFoundException('User not found');
    return { message: 'User deleted successfully' };
  }
}
