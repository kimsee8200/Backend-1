import { Module } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { PaymentController } from '../controller/payment.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/module/auth.module'; // For JwtAuthGuard
import { ConfigModule } from '@nestjs/config'; // For ConfigService

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule, // Import ConfigModule to use ConfigService
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
