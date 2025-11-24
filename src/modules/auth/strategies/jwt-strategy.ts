import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '@src/modules/users/users.service';
// las estrategias toman el nombre de donde viene en este casa usamos passport-jwt el nombre es jwt por default pero podemos cambiar el nombre
// export class JwtStrategy extends PassportStrategy(Strategy, jtw)  cambio de nombre para usar en el guard

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
  constructor(private usersService: UsersService) {
  // este super es el que valida que el token sea valido
  // secretOrKey → valida la firma
  // ignoreExpiration: false → valida la expiración
  // jwtFromRequest → valida la extracción
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
// valida solo que el usuario exista
  async validate(payload: any) {
    // payload.sub contiene userId
    const user = await this.usersService.findById(payload.sub);
    if (!user) return null;
    // se puede retornar sólo lo que se quiera exponer en req.user
    return { id: user.id, email: user.email, roles: user.roles };
  }
}
