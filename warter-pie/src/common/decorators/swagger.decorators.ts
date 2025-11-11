import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

export function RequireAuth() {
  return applyDecorators(ApiBearerAuth());
}

export function Op(summary: string, description?: string) {
  return ApiOperation({ summary, description });
}

export function Ok(desc: string) {
  return ApiResponse({ status: 200, description: desc });
}

export function Created(desc: string) {
  return ApiResponse({ status: 201, description: desc });
}

export function BadRequest(desc = '잘못된 요청 데이터') {
  return ApiResponse({ status: 400, description: desc });
}

export function Unauthorized(desc = '인증 실패') {
  return ApiResponse({ status: 401, description: desc });
}

export function Forbidden(desc = '접근 권한 없음') {
  return ApiResponse({ status: 403, description: desc });
}

export function NotFound(desc = '리소스를 찾을 수 없음') {
  return ApiResponse({ status: 404, description: desc });
}

export function SearchQueries() {
  return applyDecorators(
    ApiQuery({ name: 'name', required: false, description: '사용자 이름' }),
    ApiQuery({ name: 'userType', required: false, description: '사용자 타입' }),
    ApiQuery({
      name: 'page',
      required: false,
      description: '페이지 번호',
      type: Number,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: '페이지당 항목 수',
      type: Number,
    }),
  );
}
