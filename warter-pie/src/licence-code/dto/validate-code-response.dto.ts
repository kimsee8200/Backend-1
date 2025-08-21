import { ApiProperty } from '@nestjs/swagger';

export class ValidateCodeResponseDto {
  @ApiProperty({ example: true })
  valid: boolean;

  @ApiProperty({ example: '인증 코드가 유효합니다.' })
  message: string;
}
