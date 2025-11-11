import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentCallbackDto } from '../dto/payment-callback.dto';
import { PointTransaction, PaymentStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly tossSecretKey: string;
  private readonly tossBaseUrl = 'https://api.tosspayments.com/v1/payments';

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService, // Inject ConfigService
  ) {
    this.tossSecretKey = this.configService.get<string>(
      'TOSS_SECRET_KEY',
    ) as string;
    if (!this.tossSecretKey) {
      this.logger.error('TOSS_SECRET_KEY is not set in environment variables.');
      throw new InternalServerErrorException(
        'Payment service configuration error.',
      );
    }
  }

  async initiatePayment(
    userId: number,
    createPaymentDto: CreatePaymentDto,
  ): Promise<PointTransaction> {
    const { amount, chargedPoints, orderId, orderName } = createPaymentDto;

    // Check if orderId already exists to prevent duplicate initiation
    const existingTransaction = await this.prisma.pointTransaction.findUnique({
      where: { orderId },
    });
    if (existingTransaction) {
      throw new BadRequestException(
        'Order ID already exists. Please use a unique order ID.',
      );
    }

    // Create a pending transaction record
    const transaction = await this.prisma.pointTransaction.create({
      data: {
        userId,
        orderId,
        orderName,
        amount,
        chargedPoints,
        status: PaymentStatus.PENDING,
      },
    });

    return transaction;
  }

  async confirmPayment(
    paymentCallbackDto: PaymentCallbackDto,
  ): Promise<PointTransaction> {
    const { paymentKey, orderId, amount } = paymentCallbackDto;

    // 1. Retrieve the pending transaction from your database
    const transaction = await this.prisma.pointTransaction.findUnique({
      where: { orderId },
    });

    if (!transaction) {
      throw new NotFoundException('Payment transaction not found.');
    }

    if (transaction.status !== PaymentStatus.PENDING) {
      throw new BadRequestException(
        'Payment transaction is not in PENDING status.',
      );
    }

    if (transaction.amount !== amount) {
      throw new BadRequestException('Payment amount mismatch.');
    }

    // 2. Call Toss Payments API to confirm the payment
    try {
      const authHeader = `Basic ${Buffer.from(`${this.tossSecretKey}:`).toString('base64')}`;
      const confirmUrl = `${this.tossBaseUrl}/${paymentKey}`;

      const response = await axios.post(
        confirmUrl,
        {
          orderId: orderId,
          amount: amount,
          paymentKey: paymentKey,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader,
          },
        },
      );

      const tossResponse = response.data;

      if (
        tossResponse.status === 'DONE' ||
        tossResponse.status === 'APPROVED'
      ) {
        // 3. Update transaction status and user's points
        const updatedTransaction = await this.prisma.$transaction(
          async (tx) => {
            // Update user's points
            await tx.user.update({
              where: { id: transaction.userId },
              data: { points: { increment: transaction.chargedPoints } },
            });

            // Update transaction record
            return tx.pointTransaction.update({
              where: { id: transaction.id },
              data: {
                paymentKey: tossResponse.paymentKey,
                status: PaymentStatus.DONE,
                paymentMethod: tossResponse.method,
                paidAt: new Date(tossResponse.approvedAt),
              },
            });
          },
        );
        return updatedTransaction;
      } else if (
        tossResponse.status === 'CANCELED' ||
        tossResponse.status === 'PARTIAL_CANCELED'
      ) {
        await this.prisma.pointTransaction.update({
          where: { id: transaction.id },
          data: {
            status: PaymentStatus.CANCELED,
            paymentKey: tossResponse.paymentKey,
          },
        });
        throw new BadRequestException(
          `Payment was canceled: ${tossResponse.status}`,
        );
      } else {
        await this.prisma.pointTransaction.update({
          where: { id: transaction.id },
          data: {
            status: PaymentStatus.FAILED,
            paymentKey: tossResponse.paymentKey,
          },
        });
        throw new InternalServerErrorException(
          `Payment failed: ${tossResponse.status}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error confirming payment for orderId ${orderId}: ${error.message}`,
        error.stack,
      );
      // Re-throw or handle specific errors
      throw new InternalServerErrorException(
        'Failed to confirm payment with Toss Payments.',
      );
    }
  }

  async getPaymentHistory(userId: number): Promise<PointTransaction[]> {
    return this.prisma.pointTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
