import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ReviewPenaltySchedulerService } from './review-penalty-scheduler.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PenaltyModule } from '../penalty/module/penalty.module'; // Import PenaltyModule

@Module({
  imports: [
    ScheduleModule.forRoot(), // Initialize ScheduleModule
    PrismaModule,
    PenaltyModule, // Import PenaltyModule to use PenaltyService
  ],
  providers: [ReviewPenaltySchedulerService],
})
export class SchedulerModule {}
