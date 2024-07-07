import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDto } from '@app/common/dto/response.dto';
import { ClassConstructor, plainToInstance } from 'class-transformer';

interface Res<T> {
  success: boolean;
  message: string;
  meta: object;
  data: T;
}
@Injectable()
export class ResponseSerializeInterceptor<T>
  implements NestInterceptor<T, Res<T>>
{
  constructor(private targetDto: ClassConstructor<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Res<T>> {
    return next.handle().pipe(
      map((res: ResponseDto<T>) => ({
        success: true,
        // message could be globally localized from here from i18n or by this line
        message: res.message,
        // serialize data if needed
        data: res.ignoreSerialize
          ? res.data
          : plainToInstance(this.targetDto, res.data, {
              excludeExtraneousValues: true,
            }),

        meta: res.meta,
      })),
    );
  }
}
