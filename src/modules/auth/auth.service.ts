import {  ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@modules/users/users.service';
import { User } from '@modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto';
import { Authrepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private authRepository: Authrepository,
    @InjectRepository(RefreshToken) private rtRepo: Repository<RefreshToken>,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.createUser(dto);
    return this.createTokensForUser(user);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const matched = await this.usersService.comparePasswords(password, user.password);
    if (!matched) return null;
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    return this.createTokensForUser(user);
  }

  private async createTokensForUser(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    // Sign without passing secret/expiresIn - they're configured in the module
    const accessToken = this.jwtService.sign(payload);

    // Create a refresh token (random string) and store hashed
    const refreshPlain = crypto.randomBytes(64).toString('hex');
    const saltRounds = this.configService.get<number>('BCRYPT_SALT', 10);
    const hashed = await bcrypt.hash(refreshPlain, saltRounds);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // ej. 7 days

    const rt = await this.authRepository.create({ token: hashed, user, expiresAt });
    await this.authRepository.save(rt);

    return {
      accessToken,
      refreshToken: refreshPlain, // deliver plain to client; store only hashed
      expiresAt,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async refreshToken(userId: string, refreshTokenPlain: string) {
    const tokens = await this.authRepository.find(userId)
    for (const t of tokens) {
      const match = await bcrypt.compare(refreshTokenPlain, t.token);
      if (match) {
        // Optional: check expiry
        if (t.expiresAt && t.expiresAt < new Date()) {
          await this.authRepository.remove(t);
          throw new UnauthorizedException('Refresh token expirado');
        }
        // rotate: delete old token and issue new pair
        await this.authRepository.remove(t);
        return this.createTokensForUser(t.user);
      }
    }
    throw new UnauthorizedException('Refresh token inválido');
  }

  async logout(userId: string) {
    // delete user's refresh tokens
    await this.authRepository.delete(userId);
    return true;
  }
}
