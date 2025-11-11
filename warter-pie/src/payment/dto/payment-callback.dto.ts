import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class PaymentCallbackDto {
  @ApiProperty({ description: 'Toss Payments paymentKey' })
  @IsString()
  @IsNotEmpty()
  paymentKey: string;

  @ApiProperty({ description: 'Toss Payments orderId' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ description: 'Payment amount' })
  @IsInt()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Payment status (e.g., DONE, CANCELED, FAILED)',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string; // Toss Payments might send status in callback
}
