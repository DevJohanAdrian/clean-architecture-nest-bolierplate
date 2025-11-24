import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLoggerService } from 'src/shared/services/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Status
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // Message
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            statusCode: status,
            message: 'Internal server error'
          };

    // Logging (mínimo profesional)
    const exceptionMessage = exception instanceof Error ? exception.message : 'Unknown error';
    const exceptionStack = exception instanceof Error ? exception.stack : undefined;
    this.logger.error(
      `HTTP Error: ${status} | ${request.method} ${request.url} | ${exceptionMessage}`,
      exceptionStack
    );

    // Extract error message with proper type checking
    let errorMessage = 'Unexpected error';
    if (typeof message === 'string') {
      errorMessage = message;
    } else if (typeof message === 'object' && message !== null) {
      const msgObj = message as Record<string, unknown>;
      errorMessage = (msgObj.message as string) || (msgObj.error as string) || 'Unexpected error';
    }

    // Respuesta estandarizada
    response.status(status).json({
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      statusCode: status,
      error: errorMessage
    });
  }
}
