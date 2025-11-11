import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { PenaltyService } from '../penalty/service/penalty.service';
import { ApplicationStatus, UserType } from '@prisma/client';

@Injectable()
export class ReviewPenaltySchedulerService {
  private readonly logger = new Logger(ReviewPenaltySchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly penaltyService: PenaltyService,
  ) {}

  // Run daily at a specific time (e.g., 2 AM)
  // You can adjust the cron expression as needed
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleCron() {
    this.logger.log('Running review penalty check...');

    const overdueApplications = await this.prisma.campaignApplication.findMany({
      where: {
        status: ApplicationStatus.APPROVED, // Influencer was selected
        isPenaltyApplied: false, // Penalty not yet applied
        campaign: {
          contentDueAt: {
            lt: new Date(), // Review deadline has passed
          },
        },
        influencer: {
          // Ensure it's an influencer
          userType: UserType.INFLUENCER,
        },
      },
      include: {
        campaign: {
          select: {
            title: true,
          },
        },
        influencer: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (overdueApplications.length === 0) {
      this.logger.log('No overdue applications found.');
      return;
    }

    this.logger.log(
      `Found ${overdueApplications.length} overdue applications.`,
    );

    for (const app of overdueApplications) {
      try {
        const penaltyReason = `리뷰 기간 초과: 캠페인 "${app.campaign.title}"`;
        await this.penaltyService.applyPenalty({
          userId: app.influencer.id,
          reason: penaltyReason,
        });

        // Mark the application as penalty applied
        await this.prisma.campaignApplication.update({
          where: { id: app.id },
          data: { isPenaltyApplied: true },
        });

        this.logger.log(
          `Penalty applied for user ${app.influencer.email} (ID: ${app.influencer.id}) for campaign "${app.campaign.title}".`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to apply penalty for application ID ${app.id}: ${error.message}`,
          error.stack,
        );
      }
    }

    this.logger.log('Review penalty check completed.');
  }
}
