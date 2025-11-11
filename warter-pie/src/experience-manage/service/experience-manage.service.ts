import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExperienceInsertDataDto } from '../dto/experience-insert-data.dto';
import { ExperienceListQueryDto } from '../dto/experience-list.query.dto';
import { ExperienceUpdateDataDto } from '../dto/experience-update-data.dto';
import {
  ApplicationStatus,
  CampaignStatus,
  PaymentStatus,
  SubmissionStatus,
} from '@prisma/client';
import { CampaignReviewItemDto } from '../dto/response/campaign-review-list.response.dto';
import { PenaltyService } from '../../penalty/service/penalty.service'; // Import PenaltyService
import { S3ImageUploadService } from '../../image-upload/s3-image-upload.service';
// Import new DTO

interface InsertFiles {
  president_image: any | null;
  images: any[];
}

interface UpdateFiles {
  president_image?: any | null;
  images?: any[];
}

@Injectable()
export class ExperienceManageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly penaltyService: PenaltyService,
    private readonly imageUploadService: S3ImageUploadService,
  ) {}

  async listCampaignReviews(
    ownerUserId: number,
    campaignId: number,
  ): Promise<CampaignReviewItemDto[]> {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign || campaign.ownerUserId !== ownerUserId) {
      throw new BadRequestException('리뷰를 조회할 권한이 없습니다.');
    }

    const applications = await this.prisma.campaignApplication.findMany({
      where: { campaignId: campaignId },
      include: {
        influencer: {
          select: {
            id: true,
            name: true,
          },
        },
        submissions: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return applications.map((app) => {
      const latestSubmission = app.submissions[0]; // Get the most recent submission
      return {
        applicationId: app.id,
        influencerId: app.influencerUserId,
        influencerName: app.influencer.name,
        submissionStatus: latestSubmission
          ? latestSubmission.status
          : SubmissionStatus.PENDING_REVIEW,
        reviewMessage: latestSubmission?.note ?? '',
        reviewUrls: latestSubmission?.urls ?? [],
        submittedAt: latestSubmission?.createdAt ?? null,
      };
    });
  }

  async insertExperience(
    ownerUserId: number,
    data: ExperienceInsertDataDto,
    files: InsertFiles,
  ) {
    if (!Array.isArray(data.channels) || data.channels.length === 0) {
      throw new BadRequestException('channels는 최소 1개 이상이어야 합니다.');
    }

    const presidentImagePath = files.president_image
      ? await this.imageUploadService.save(files.president_image)
      : null;
    const imagePaths = files.images?.length
      ? await this.imageUploadService.saveMany(files.images)
      : [];

    const result = await this.prisma.$transaction(async (tx) => {
      const campaign = await tx.campaign.create({
        data: {
          ownerUserId,
          title: data.title,
          description: data.offer_content ?? '',
          headcount: data.member_num,
          applyStartAt: new Date(data.possible_time_application[0]),
          applyEndAt: new Date(data.possible_time_application[1]),
          contentDueAt: new Date(data.end_review_time),
          rewardType: 'POINT',
          rewardAmount: data.each_member_point,
          dataType: data.data_type,
          productOfferType: data.product_offer_type,
          experienceMission: data.experience_mission ?? null,
          offerContent: data.offer_content ?? null,
          charge: data.charge ?? null,
          presidentImage: presidentImagePath,
        },
      });

      await tx.campaignProfile.create({
        data: {
          campaignId: campaign.id,
          companyName: data.company_name,
          managerCallNum: data.manager_call_num ?? null,
          address: data.address,
          detailAddress: data.detail_address ?? null,
          category: (data as any).cartegory ?? data.category ?? null,
          productUrl: data.product_url ?? null,
        },
      });

      await tx.campaignTiming.create({
        data: {
          campaignId: campaign.id,
          memberAnnouncementDate: new Date(data.member_announcement_time),
          experienceStartAt: new Date(data.experience_time[0]),
          experienceEndAt: new Date(data.experience_time[1]),
          reviewEndAt: new Date(data.end_review_time),
        },
      });

      await tx.campaignVisitRule.create({
        data: {
          campaignId: campaign.id,
          possibleTimeStart: data.possible_time?.[0] ?? null,
          possibleTimeEnd: data.possible_time?.[1] ?? null,
          possibleVisitNow: data.possible_visit_now ?? false,
          noticesToVisit: data.notices_to_visit ?? null,
        },
      });

      const ch = (data as any).chennals as number[] | undefined;
      const channels = data.channels ?? ch ?? [];
      if (channels?.length) {
        await tx.campaignChannel.createMany({
          data: channels.map((c) => ({ campaignId: campaign.id, channel: c })),
          skipDuplicates: true,
        });
      }

      if (data.possible_week_days?.length) {
        await tx.campaignVisitWeekday.createMany({
          data: data.possible_week_days.map((w) => ({
            campaignId: campaign.id,
            weekday: w,
          })),
          skipDuplicates: true,
        });
      }

      if (data.marketing_keywords?.length) {
        await tx.campaignKeyword.createMany({
          data: data.marketing_keywords.map((k) => ({
            campaignId: campaign.id,
            keyword: k,
          })),
          skipDuplicates: true,
        });
      }

      if (imagePaths.length) {
        await tx.campaignImage.createMany({
          data: imagePaths.map((url, idx) => ({
            campaignId: campaign.id,
            url,
            sortOrder: idx,
          })),
        });
      }

      return campaign.id;
    });

    return { campaignId: result };
  }

  async listExperiences(ownerUserId: number, query: ExperienceListQueryDto) {
    const { keyword, channels, productOfferType } = query;

    const where: any = {
      ownerUserId,
    };
    if (productOfferType) where.productOfferType = productOfferType;
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        {
          profile: { companyName: { contains: keyword, mode: 'insensitive' } },
        },
      ];
    }
    if (channels?.length) {
      where.channelsRel = {
        some: { channel: { in: channels } },
      };
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.campaign.findMany({
        where,
        include: {
          profile: true,
          timing: true,
          images: { orderBy: { sortOrder: 'asc' } },
          channelsRel: true,
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.campaign.count({ where }),
    ]);

    const now = new Date();
    const dayMs = 24 * 60 * 60 * 1000;

    const mappedItems = items.map((c) => ({
      id: c.id,
      data_type: c.dataType ?? null,
      product_offer_type: c.productOfferType ?? null,
      cartegory: c.profile?.category ?? '',
      chennals: c.channelsRel.map((x) => x.channel),
      possible_time_application_left: Math.max(
        0,
        Math.ceil((c.applyEndAt.getTime() - now.getTime()) / dayMs),
      ),

      title: c.title,
      offer_content: c.offerContent ?? '',
      member_num: c.headcount,
      applicated_num: c._count.applications,
      each_member_point: c.rewardAmount ?? 0,
      image_urls: (c.images || []).map((img) => img.url),
      is_point_experience: (c.rewardType ?? 'POINT') === 'POINT',
    }));

    return mappedItems;
  }

  async updateExperience(
    ownerUserId: number,
    campaignId: number,
    data: ExperienceUpdateDataDto,
    files?: UpdateFiles,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.campaign.findUnique({
        where: { id: campaignId },
        include: { owner: true },
      });
      if (!existing || existing.ownerUserId !== ownerUserId)
        throw new BadRequestException('수정 권한이 없습니다.');

      const updateCampaign: any = {};
      if ('title' in data) updateCampaign.title = data.title;
      if ('member_num' in data) updateCampaign.headcount = data.member_num;
      if (
        Array.isArray(data.possible_time_application) &&
        data.possible_time_application.length === 2
      ) {
        updateCampaign.applyStartAt = new Date(
          data.possible_time_application[0],
        );
        updateCampaign.applyEndAt = new Date(data.possible_time_application[1]);
      }
      if (typeof data.end_review_time === 'string')
        updateCampaign.contentDueAt = new Date(data.end_review_time);
      if ('each_member_point' in data)
        updateCampaign.rewardAmount = data.each_member_point;
      if ('product_offer_type' in data)
        updateCampaign.productOfferType = data.product_offer_type;
      if ('data_type' in data) updateCampaign.dataType = data.data_type;
      if ('offer_content' in data)
        updateCampaign.offerContent = data.offer_content;
      if ('experience_mission' in data)
        updateCampaign.experienceMission = data.experience_mission;
      if ('charge' in data) updateCampaign.charge = data.charge;

      if (files?.president_image) {
        updateCampaign.presidentImage = await this.imageUploadService.save(
          files.president_image,
        );
      }

      if (Object.keys(updateCampaign).length) {
        await tx.campaign.update({
          where: { id: campaignId },
          data: updateCampaign,
        });
      }

      // profile
      const updateProfile: any = {};
      if ('company_name' in data) updateProfile.companyName = data.company_name;
      if ('manager_call_num' in data)
        updateProfile.managerCallNum = data.manager_call_num;
      if ('address' in data) updateProfile.address = data.address;
      if ('detail_address' in data)
        updateProfile.detailAddress = data.detail_address;
      if ('category' in data || 'cartegory' in data)
        updateProfile.category = (data as any).cartegory ?? data.category;
      if ('product_url' in data) updateProfile.productUrl = data.product_url;
      if (Object.keys(updateProfile).length) {
        await tx.campaignProfile.upsert({
          where: { campaignId },
          update: updateProfile,
          create: {
            campaignId,
            ...updateProfile,
            companyName: (data as any).company_name ?? existing.title,
          },
        });
      }

      // timing
      const updateTiming: any = {};
      if (typeof data.member_announcement_time === 'string')
        updateTiming.memberAnnouncementDate = new Date(
          data.member_announcement_time,
        );
      if (
        Array.isArray(data.experience_time) &&
        data.experience_time.length === 2
      ) {
        updateTiming.experienceStartAt = new Date(data.experience_time[0]);
        updateTiming.experienceEndAt = new Date(data.experience_time[1]);
      }
      if (typeof data.end_review_time === 'string')
        updateTiming.reviewEndAt = new Date(data.end_review_time);
      if (Object.keys(updateTiming).length) {
        await tx.campaignTiming.upsert({
          where: { campaignId },
          update: updateTiming,
          create: { campaignId, ...updateTiming },
        });
      }

      // visit rule
      const updateVisit: any = {};
      if (Array.isArray(data.possible_time)) {
        updateVisit.possibleTimeStart = data.possible_time[0] ?? null;
        updateVisit.possibleTimeEnd = data.possible_time[1] ?? null;
      }
      if ('possible_visit_now' in data)
        updateVisit.possibleVisitNow = !!data.possible_visit_now;
      if ('notices_to_visit' in data)
        updateVisit.noticesToVisit = data.notices_to_visit ?? null;
      if (Object.keys(updateVisit).length) {
        await tx.campaignVisitRule.upsert({
          where: { campaignId },
          update: updateVisit,
          create: { campaignId, ...updateVisit },
        });
      }

      // channels (support chennals alias)
      if ('channels' in data || 'chennals' in (data as any)) {
        const channels = (data.channels ??
          (data as any).chennals ??
          []) as number[];
        await tx.campaignChannel.deleteMany({ where: { campaignId } });
        if (channels.length) {
          await tx.campaignChannel.createMany({
            data: channels.map((c) => ({ campaignId, channel: c })),
            skipDuplicates: true,
          });
        }
      }

      // weekdays
      if (Array.isArray(data.possible_week_days)) {
        await tx.campaignVisitWeekday.deleteMany({ where: { campaignId } });
        if (data.possible_week_days.length) {
          await tx.campaignVisitWeekday.createMany({
            data: data.possible_week_days.map((w) => ({
              campaignId,
              weekday: w,
            })),
            skipDuplicates: true,
          });
        }
      }

      // keywords
      if (Array.isArray(data.marketing_keywords)) {
        await tx.campaignKeyword.deleteMany({ where: { campaignId } });
        if (data.marketing_keywords.length) {
          await tx.campaignKeyword.createMany({
            data: data.marketing_keywords.map((k) => ({
              campaignId,
              keyword: k,
            })),
            skipDuplicates: true,
          });
        }
      }

      // images
      if (files?.images && files.images.length) {
        const imageUrls = await this.imageUploadService.saveMany(files.images);
        await tx.campaignImage.deleteMany({ where: { campaignId } });
        await tx.campaignImage.createMany({
          data: imageUrls.map((url, idx) => ({
            campaignId,
            url,
            sortOrder: idx,
          })),
        });
      }

      return { updated: true };
    });
  }

  async deleteExperience(ownerUserId: number, campaignId: number) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.campaign.findUnique({
        where: { id: campaignId },
        include: {
          images: true,
        },
      });
      if (!existing || existing.ownerUserId !== ownerUserId)
        throw new BadRequestException('삭제 권한이 없습니다.');

      // Collect S3 keys to delete
      const keysToDelete: string[] = [];
      if (existing.presidentImage) {
        keysToDelete.push(existing.presidentImage);
      }
      existing.images.forEach((image) => {
        if (image.url) {
          keysToDelete.push(image.url);
        }
      });

      // Delete images from S3
      if (keysToDelete.length > 0) {
        await this.imageUploadService.deleteMany(keysToDelete);
      }

      // Delete campaign from DB
      await tx.campaign.delete({ where: { id: campaignId } });
      return { deleted: true };
    });
  }

  async selectInfluencers(
    ownerUserId: number,
    campaignId: number,
    applicationIds: string[],
  ) {
    if (!applicationIds?.length)
      throw new BadRequestException('applicationIds가 필요합니다.');

    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign || campaign.ownerUserId !== ownerUserId)
      throw new BadRequestException('선정 권한이 없습니다.');

    const apps = await this.prisma.campaignApplication.findMany({
      where: { influencer: { email: { in: applicationIds } }, campaignId },
      select: { id: true },
    });
    if (apps.length !== applicationIds.length)
      throw new BadRequestException('잘못된 신청이 포함되어 있습니다.');

    const appIds = apps.map((app) => app.id);

    await this.prisma.campaignApplication.updateMany({
      where: { id: { in: appIds }, campaignId },
      data: { status: ApplicationStatus.APPROVED },
    });

    return { selected: applicationIds.length };
  }

  // 체험단 상세 조회
  async getExperienceDetail(campaignId: number) {
    const c = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        profile: true,
        timing: true,
        visitRule: true,
        channelsRel: true,
        visitWeekdays: true,
        keywords: true,
        images: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { applications: true } },
      },
    });
    if (!c) throw new BadRequestException('존재하지 않는 체험단입니다.');

    return {
      data_type: c.dataType ?? null,
      company_name: c.profile?.companyName ?? '',
      manager_call_num: c.profile?.managerCallNum ?? null,
      product_offer_type: c.productOfferType ?? null,
      address: c.profile?.address ?? '',
      detail_address: c.profile?.detailAddress ?? null,
      category: c.profile?.category ?? null,
      product_url: c.profile?.productUrl ?? null,
      channels: c.channelsRel.map((x) => x.channel),
      possible_time_application: [c.applyStartAt, c.applyEndAt],
      member_announcement_time: c.timing?.memberAnnouncementDate ?? null,
      experience_time: [
        c.timing?.experienceStartAt ?? null,
        c.timing?.experienceEndAt ?? null,
      ],
      end_review_time: c.timing?.reviewEndAt ?? null,
      possible_time: [
        c.visitRule?.possibleTimeStart ?? null,
        c.visitRule?.possibleTimeEnd ?? null,
      ],
      possible_week_days: c.visitWeekdays.map((w) => w.weekday),
      possible_visit_now: c.visitRule?.possibleVisitNow ?? false,
      notices_to_visit: c.visitRule?.noticesToVisit ?? null,
      experience_mission: c.experienceMission ?? null,
      marketing_keywords: c.keywords.map((k) => k.keyword),
      title: c.title,
      offer_content: c.offerContent ?? '',
      member_num: c.headcount,
      applicated_num: c._count.applications,
      each_member_point: c.rewardAmount ?? 0,
      charge: c.charge ?? null,
      president_image: c.presidentImage ?? null,
      image_urls: c.images.map((img) => img.url),
      is_point_experience: (c.rewardType ?? 'POINT') === 'POINT',
    };
  }

  async listApplications(
    ownerUserId: number,
    campaignId: number,
    status?: ApplicationStatus,
  ) {
    const camp = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });
    if (!camp || camp.ownerUserId !== ownerUserId)
      throw new BadRequestException('조회 권한이 없습니다.');

    const where: any = { campaignId };
    if (status) where.status = status;

    const apps = await this.prisma.campaignApplication.findMany({
      where,
      include: {
        influencer: {
          select: {
            id: true,
            email: true,
            name: true,
            influencer: {
              select: {
                youtubeUrl: true,
                blogUrl: true,
                instagramUrl: true,
                tiktokUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const itemsWithPenalties = await Promise.all(
      apps.map(async (a) => {
        const penaltyCount = await this.penaltyService.getPenaltyCountForUser(
          a.influencerUserId,
        );
        return {
          application_id: a.id,
          influencer_id: a.influencerUserId,
          influencer_name: (a as any).influencer?.name ?? '',
          influencer_email: a.influencer.email,
          status: a.status,
          pitch_text: a.pitchText ?? null,
          created_at: a.createdAt,
          penalty_count: penaltyCount,
          youtube_url: a.influencer.influencer?.youtubeUrl ?? null,
          blog_url: a.influencer.influencer?.blogUrl ?? null,
          instagram_url: a.influencer.influencer?.instagramUrl ?? null,
          tiktok_url: a.influencer.influencer?.tiktokUrl ?? null,
        };
      }),
    );

    return itemsWithPenalties;
  }

  async reviewApplication(
    ownerUserId: number,
    applicationId: number,
    decision: 'approve' | 'reject',
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Validate Application, latest submission, and Ownership
      const application = await tx.campaignApplication.findUnique({
        where: { id: applicationId },
        include: {
          campaign: true,
          submissions: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      if (!application) {
        throw new NotFoundException('신청 내역을 찾을 수 없습니다.');
      }

      if (application.campaign.ownerUserId !== ownerUserId) {
        throw new ForbiddenException('리뷰를 심사할 권한이 없습니다.');
      }

      const latestSubmission = application.submissions[0];

      if (!latestSubmission) {
        throw new BadRequestException('아직 제출된 리뷰가 없습니다.');
      }

      if (latestSubmission.status !== SubmissionStatus.PENDING_REVIEW) {
        throw new BadRequestException('이미 처리된 리뷰입니다.');
      }

      const newStatus =
        decision === 'approve'
          ? SubmissionStatus.APPROVED
          : SubmissionStatus.REJECTED;

      // 2. Update Submission Status
      await tx.campaignSubmission.update({
        where: { id: latestSubmission.id },
        data: { status: newStatus },
      });

      // 3. If approved, award points
      if (decision === 'approve') {
        const rewardAmount = application.campaign.rewardAmount;
        if (!rewardAmount || rewardAmount <= 0) {
          throw new BadRequestException(
            '캠페인에 리워드가 설정되지 않았습니다.',
          );
        }

        const influencerId = application.influencerUserId;

        // 3a. Award Points to Influencer
        await tx.user.update({
          where: { id: influencerId },
          data: { points: { increment: rewardAmount } },
        });

        // 3b. Log Point Transaction
        await tx.pointTransaction.create({
          data: {
            userId: influencerId,
            orderId: `reward-submission-${latestSubmission.id}-${new Date().getTime()}`,
            orderName: `${application.campaign.title} 리뷰 보상`,
            amount: rewardAmount,
            chargedPoints: rewardAmount,
            status: PaymentStatus.DONE,
            paymentMethod: 'CAMPAIGN_REWARD',
            paidAt: new Date(),
          },
        });
        return {
          reviewed: true,
          status: newStatus,
          awardedPoints: rewardAmount,
        };
      }

      // if rejected
      return { reviewed: true, status: newStatus };
    });
  }

  async cancelApplication(ownerUserId: number, applicationId: number) {
    const app = await this.prisma.campaignApplication.findUnique({
      where: { id: applicationId },
      include: { campaign: true },
    });
    if (!app || app.campaign.ownerUserId !== ownerUserId)
      throw new BadRequestException('취소 권한이 없습니다.');
    await this.prisma.campaignApplication.update({
      where: { id: applicationId },
      data: { status: ApplicationStatus.CANCELLED },
    });
    return { cancelled: true };
  }

  async updateStatus(
    ownerUserId: number,
    campaignId: number,
    status: CampaignStatus,
  ) {
    const camp = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });
    if (!camp || camp.ownerUserId !== ownerUserId)
      throw new BadRequestException('상태 변경 권한이 없습니다.');
    await this.prisma.campaign.update({
      where: { id: campaignId },
      data: { status },
    });
    return { status };
  }
}
