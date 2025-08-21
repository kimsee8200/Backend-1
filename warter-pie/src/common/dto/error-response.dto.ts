import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 'error' })
  status: 'error';

  @ApiProperty({ example: '요청이 올바르지 않습니다.' })
  message: string;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: '/users/me' })
  path: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
