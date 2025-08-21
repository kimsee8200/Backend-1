import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto<T = any> {
  @ApiProperty({ example: 'success' })
  status: 'success';

  @ApiProperty({ example: '정상적으로 처리되었습니다.' })
  message: string;

  @ApiProperty({ description: '응답 데이터' })
  data: T | null;
}
