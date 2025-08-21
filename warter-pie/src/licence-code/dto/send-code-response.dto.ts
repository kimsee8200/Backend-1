import { ApiProperty } from '@nestjs/swagger';

export class SendCodeResponseDto {
  @ApiProperty({ example: true })
  sent: boolean;

  @ApiProperty({ example: 'user@example.com' })
  email: string;
}
