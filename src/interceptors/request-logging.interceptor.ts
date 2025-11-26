import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AppLoggerService } from '@shared/services/logger.service'; // ajusta la ruta según tu proyecto

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now(); // Marca de tiempo inicial

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    // Datos útiles del request
    const { method, originalUrl, ip, body, query, headers } = req;
    const userAgent = headers['user-agent'] || '';

    // Log de entrada del request
    this.logger.log(
      `Incoming Request → ${method} ${originalUrl} | IP: ${ip} | User-Agent: ${userAgent}`
    );

    return next.handle().pipe(
      tap(() => {
        const duration = `${Date.now() - now}ms`; // tiempo de ejecución

        // Log de salida del request con status code
        this.logger.log(
          `Response → ${method} ${originalUrl} | Status: ${res.statusCode} | Duration: ${duration}`
        );

        // Si quieres loggear body o query (solo en desarrollo)
        if (process.env.NODE_ENV === 'development') {
          this.logger.debug(
            `Request Data: body=${JSON.stringify(body)} query=${JSON.stringify(query)}`
          );
        }
      })
    );
  }
}
