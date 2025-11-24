import { Injectable, UnauthorizedException, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@modules/users/users.service'
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  private async createTokensForUser(user) {
    const payload = { sub: user.id, email: user.email, roles: user.roles };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION || '15m',
    });

    // Create a refresh token (random string) and store hashed
    const refreshPlain = crypto.randomBytes(64).toString('hex');
    const hashed = await bcrypt.hash(refreshPlain, Number(process.env.BCRYPT_SALT || 10));

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // ej. 7 days

    const rt = this.rtRepo.create({ token: hashed, user, expiresAt });
    await this.rtRepo.save(rt);

    return {
      accessToken,
      refreshToken: refreshPlain, // deliver plain to client; store only hashed
      expiresAt,
      user: { id: user.id, email: user.email, roles: user.roles },
    };
  }

  async refreshToken(userId: string, refreshTokenPlain: string) {
    const tokens = await this.rtRepo.find({ where: { user: { id: userId } } , relations: ['user']});
    for (const t of tokens) {
      const match = await bcrypt.compare(refreshTokenPlain, t.token);
      if (match) {
        // Optional: check expiry
        if (t.expiresAt && t.expiresAt < new Date()) {
          await this.rtRepo.remove(t);
          throw new UnauthorizedException('Refresh token expirado');
        }
        // rotate: delete old token and issue new pair
        await this.rtRepo.remove(t);
        return this.createTokensForUser(t.user);
      }
    }
    throw new UnauthorizedException('Refresh token inválido');
  }

  async logout(userId: string) {
    // delete user's refresh tokens
    await this.rtRepo.delete({ user: { id: userId } } as any);
    return true;
  }
}
