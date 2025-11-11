import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';

export class PaymentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  orderId: string;

  @ApiProperty()
  orderName: string;

  @ApiProperty({ nullable: true })
  paymentKey: string | null;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  chargedPoints: number;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty({ nullable: true })
  paymentMethod: string | null;

  @ApiProperty({ nullable: true })
  paidAt: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
