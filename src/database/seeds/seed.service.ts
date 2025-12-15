import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { User, Role } from '@modules/users/entities';
import { RefreshToken } from '@modules/auth/entities';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(RefreshToken)
    private readonly refreshRepo: Repository<RefreshToken>,
    private configService: ConfigService
  ) {}

  async run() {
    console.log('🌱 Ejecutando seed...');

    // // 1. Crear roles

    // const adminRole = await this.roleRepo.save({
    //   code: 'C01',
    //   name: 'admin'
    // });

    // const managerRole = await this.roleRepo.save({
    //   code: 'C02',
    //   name: 'manager'
    // });

    // const userRole = await this.roleRepo.save({
    //   code: 'C03',
    //   name: 'user'
    // });


    // saltRounds para contraseña y refreshtoken
    const saltRounds = Number(this.configService.get<number>('BCRYPT_SALT') ?? 12);

    // 2. Crear usuario admin
    const hashedPassword = await bcrypt.hash('123456', saltRounds);
    const adminRolToassign = await this.roleRepo.findOne({where:{code:'C01'}})
    const adminUser = await this.userRepo.save({
      email: 'admin@example.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: adminRolToassign
    });

    // 3. Crear refresh token inicial
    const refreshPlain = crypto.randomBytes(64).toString('hex');
    const token = await bcrypt.hash(refreshPlain, saltRounds);

    await this.refreshRepo.save({
      token,
      user: adminUser,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
    });

    console.log('🎉 Seed completado con éxito');
  }
}
