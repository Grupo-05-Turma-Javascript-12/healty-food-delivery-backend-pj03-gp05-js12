import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.info('HTTP Request', {
            method,
            url,
            statusCode: response.statusCode,
            duration_ms: Date.now() - startTime,
          });
        },
        error: (error) => {
          this.logger.error('HTTP Error', {
            method,
            url,
            statusCode: error.status ?? 500,
            duration_ms: Date.now() - startTime,
            error: error.message,
          });
        },
      }),
    );
  }
}
