import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';
import 'reflect-metadata';

interface ClassConstructor {
  new (...args: unknown[]): object;
}

export function Serializable(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: new () => T) {}

  intercept(
    context: ExecutionContext,
    handler: CallHandler<T>,
  ): Observable<T> | Promise<Observable<T>> {
    return handler.handle().pipe(
      map(
        (data: unknown) =>
          plainToInstance(this.dto, data, {
            excludeExtraneousValues: true,
          }) as T,
      ),
    );
  }
}
