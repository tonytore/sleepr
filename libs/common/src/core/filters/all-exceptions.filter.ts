import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';

import type { RootConfig } from 'src/configs/config.type';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService<RootConfig>,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const httpStatus = this.getHttpStatus(exception);
    const message = this.getErrorMessage(exception);

    const responseBody = this.getResponseBody(
      exception,
      host,
      httpAdapter,
      httpStatus,
      message,
    );

    this.logException(exception, httpStatus);

    httpAdapter.reply(
      host.switchToHttp().getResponse(),
      responseBody,
      httpStatus,
    );
  }

  private getHttpStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse() as
        | string
        | { message?: string | string[] };

      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        const { message } = response;
        if (Array.isArray(message) && message.length > 0) {
          return message[0];
        }
        if (typeof message === 'string') {
          return message;
        }
      }
      return exception.message;
    }

    return 'Internal server error';
  }

  private getResponseBody(
    exception: unknown,
    host: ArgumentsHost,
    httpAdapter: HttpAdapterHost['httpAdapter'],
    httpStatus: number,
    message: string,
  ): Record<string, any> {
    const isProduction =
      this.configService.get('app', { infer: true })!.nodeEnv === 'production';

    const ctx = host.switchToHttp();

    // Extract detailed description if available (e.g. from ConflictException)
    let details =
      exception instanceof Error ? exception.message : 'Unknown error';
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'object' && response !== null) {
        const responseObj = response as Record<string, unknown>;
        const desc = responseObj.description ?? responseObj.details;
        if (typeof desc === 'string') {
          details = desc;
        }
      }
    }

    return {
      success: false,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest<Request>()) as string,
      message,
      ...(!isProduction && {
        details,
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    };
  }

  private logException(exception: unknown, httpStatus: number): void {
    let message = 'Unknown';
    if (exception instanceof Error) {
      message = exception.message;
    }
    const stack = exception instanceof Error ? exception.stack : undefined;

    if (httpStatus >= 500) {
      this.logger.error(`Unhandled Exception: ${message}`, stack);
    } else {
      this.logger.warn(`Http Exception: ${message}`);
    }
  }
}
