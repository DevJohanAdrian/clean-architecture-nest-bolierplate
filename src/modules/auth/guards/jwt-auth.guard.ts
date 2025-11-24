import { AuthGuard } from '@nestjs/passport';
// Cuando este guard se dispare… llama a la estrategia de Passport cuyo nombre sea jwt.
// El guard no necesita importar tu estrategia porque Passport ya la tiene registrada por su nombre.
export class JwtAuthGuard extends AuthGuard('jwt') {}
