import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      // metatype이 없거나 유효성 검사 대상이 아닌 경우
      return value;
    }

    const object = plainToInstance(metatype, value); // value를 metatype으로 변환

    const errors = await validate(object, {
      whitelist: true, // (true로 설정하면 유효성 검사를 위한 데코레이터가 없는 속성은 무시됩니다.)
      transform: true, // (true로 설정하면 유효성 검사 전에 값을 변환합니다.)
      forbidNonWhitelisted: true, // 허용되지 않는 필드를 에러로 처리
    }); // 변환된 object를 검증

    if (errors.length > 0) {
      const constraints = errors
        .map((error) => error.constraints) // 에러 메시지를 가져옴
        .filter((constraint) => constraint !== undefined) // 에러 메시지가 있는 것만 필터링
        .map((constraint) => Object.values(constraint)) // 에러 메시지를 배열로 변환
        .join(', '); // 배열을 문자열로 변환

      throw new BadRequestException(constraints); // 에러를 던짐
    }

    return object;
  }

  private toValidate(metatype: unknown): boolean {
    const types: unknown[] = [String, Boolean, Number, Array, Object]; // 유효성 검사 대상 타입
    return !types.includes(metatype); // 유효성 검사 대상이면 false를 반환
  }
}
