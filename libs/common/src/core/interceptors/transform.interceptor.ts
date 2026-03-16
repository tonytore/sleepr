import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T | unknown[];
  meta?: unknown;
  pagination?: unknown;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse<ExpressResponse>();

    const contentType = response?.getHeader?.('Content-Type');
    if (typeof contentType === 'string' && contentType.includes('text/csv')) {
      return next.handle() as Observable<Response<T>>;
    }

    return next.handle().pipe(
      map((data: unknown) => {
        const result = this.processData(data);

        return {
          success: true,
          statusCode: response.statusCode,
          ...result,
        } as Response<T>;
      }),
    );
  }

  private processData(data: unknown) {
    let message = 'Operation successful';
    let responseData: unknown = undefined;
    let meta: unknown = undefined;
    let pagination: unknown = undefined;

    if (data && typeof data === 'object') {
      const payload = data as Record<string, unknown>;

      if (typeof payload.message === 'string') {
        message = payload.message;
      }

      if ('pagination' in payload) {
        responseData = payload.data || payload.items;
        pagination = payload.pagination;
      } else if ('meta' in payload) {
        responseData = payload.data;
        meta = payload.meta;
      } else if ('data' in payload) {
        responseData = payload.data;
      } else {
        responseData = this.extractResponseData(payload);
      }
    } else {
      responseData = data;
    }

    const result: Record<string, unknown> = { message };
    if (responseData !== undefined) result.data = responseData;
    if (meta !== undefined) result.meta = meta;
    if (pagination !== undefined) result.pagination = pagination;

    return result;
  }

  private extractResponseData(payload: Record<string, unknown>) {
    if ('message' in payload && Object.keys(payload).length > 1) {
      const rest = { ...payload };
      delete rest.message;
      return rest;
    }
    return payload;
  }
}
