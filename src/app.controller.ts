import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Public health check endpoint - excluded from rate limiting
   * 
   * @SkipThrottle() decorator excludes this endpoint from all rate limiting rules.
   * This is useful for:
   * - Health check endpoints that monitoring systems call frequently
   * - Public endpoints that should always be accessible
   * - Status endpoints used by load balancers
   * 
   * Without this decorator, the global ThrottlerGuard would apply the default limits.
   */
  @SkipThrottle()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
