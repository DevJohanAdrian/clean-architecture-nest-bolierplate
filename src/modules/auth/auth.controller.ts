import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthUser } from './decorators/auth-user.decorator';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  async refresh(@Body() body: { userId: string; refreshToken: string }) {
    return this.authService.refreshToken(body.userId, body.refreshToken);
  }

  @UseGuards(JwtAuthGuard) // dispara jwtstrategy que valida en token y regresa un req.user en el metodo validate en caso de que el jwt sea valido
  // @AuthUser('id') extrae el id de req.user, pero puede extraer otros campos que esten dentro de el obj user
  @Post('logout')
  async logout(@AuthUser('id') userId: string) {
    return this.authService.logout(userId);
  }
}
