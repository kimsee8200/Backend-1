import { Module } from '@nestjs/common';
import { PenaltyService } from '../service/penalty.service';
import { PenaltyController } from '../controller/penalty.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/module/auth.module'; // For JwtAuthGuard and AdminGuard

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PenaltyController],
  providers: [PenaltyService],
  exports: [PenaltyService],
})
export class PenaltyModule {}
