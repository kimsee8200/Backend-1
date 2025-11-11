import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentCallbackDto } from '../dto/payment-callback.dto';
import { JwtAuthGuard } from '../../auth/passport/jwt/jwt-auth.guard';
import { CurrentUser } from '../../user/decorators/current-user.decorator';
import { CurrentUserPayload } from '../../user/decorators/current-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaymentResponseDto } from '../dto/payment-response.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'Initiate a new payment transaction' })
  @ApiResponse({
    status: 201,
    description: 'Payment initiated successfully.',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g., duplicate orderId).',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async initiatePayment(
    @CurrentUser() user: CurrentUserPayload,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentService.initiatePayment(user.userId, createPaymentDto);
  }

  @Post('confirm')
  @HttpCode(HttpStatus.OK) // Return 200 OK for successful confirmation
  @ApiOperation({ summary: 'Confirm a payment transaction with Toss Payments' })
  @ApiResponse({
    status: 200,
    description: 'Payment confirmed successfully.',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g., amount mismatch, invalid status).',
  })
  @ApiResponse({ status: 404, description: 'Payment transaction not found.' })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error (e.g., Toss Payments API error).',
  })
  async confirmPayment(@Body() paymentCallbackDto: PaymentCallbackDto) {
    // This endpoint can be called by Toss Payments webhook or by client after redirect
    return this.paymentService.confirmPayment(paymentCallbackDto);
  }

  @Get('history')
  @ApiOperation({ summary: "Get current user's payment history" })
  @ApiResponse({
    status: 200,
    description: 'List of payment transactions.',
    type: [PaymentResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getPaymentHistory(@CurrentUser() user: CurrentUserPayload) {
    return this.paymentService.getPaymentHistory(user.userId);
  }
}
