import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PostReviewDto } from '../dto/post-review.dto';
import { ExperienceListItemDto } from '../dto/response/experience-list-item.dto';
import { ExperienceDetailDto } from '../dto/response/experience-detail.dto';
import { MyReviewItemDto } from '../dto/response/my-review-list.dto';
import { ExperienceListQueryDto } from '../../experience-manage/dto/experience-list.query.dto';

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  // 목록/검색(선택 인증)
  async list(query: ExperienceListQueryDto) {
    const { keyword, channels, productOfferType } = query;

    const where: any = {};
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
      data_type: c.dataType ?? 1,
      product_offer_type: c.productOfferType ?? 1,
      cartegory: c.profile?.category ?? '',
      channels: c.channelsRel.map((x) => x.channel),
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

  // 상세(선택 인증)
  async detail(
    id: number,
    userId: number | null,
  ): Promise<ExperienceDetailDto> {
    const c = await this.prisma.campaign.findUnique({
      where: { id },
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
    if (!c) throw new NotFoundException('체험단이 존재하지 않습니다.');

    return {
      id: c.id,
      writer: '',
      data_type: c.dataType ?? 1,
      company_name: c.profile?.companyName ?? '',
      manager_call_num: c.profile?.managerCallNum ?? '',
      product_offer_type: c.productOfferType ?? 1,
      address: c.profile?.address ?? '',
      detail_address: c.profile?.detailAddress ?? '',
      cartegory: c.profile?.category ?? '',
      product_url: c.profile?.productUrl ?? '',
      channels: c.channelsRel.map((x) => x.channel),
      possible_time_application: [
        c.applyStartAt.toISOString().slice(0, 10),
        c.applyEndAt.toISOString().slice(0, 10),
      ],
      member_announcement_time:
        c.timing?.memberAnnouncementDate?.toISOString().slice(0, 10) ?? '',
      experience_time: [
        c.timing?.experienceStartAt?.toISOString().slice(0, 10) ?? '',
        c.timing?.experienceEndAt?.toISOString().slice(0, 10) ?? '',
      ],
      end_review_time: c.timing?.reviewEndAt?.toISOString().slice(0, 10) ?? '',
      possible_time: [
        c.visitRule?.possibleTimeStart ?? '',
        c.visitRule?.possibleTimeEnd ?? '',
      ],
      possible_week_days: c.visitWeekdays.map((w) => w.weekday),
      possible_visit_now: c.visitRule?.possibleVisitNow ?? false,
      notices_to_visit: c.visitRule?.noticesToVisit ?? '',
      experience_mission: c.experienceMission ?? '',
      marketing_keywords: c.keywords.map((k) => k.keyword),
      title: c.title,
      offer_content: c.offerContent ?? '',
      member_num: c.headcount,
      applicated_num: c._count.applications,
      each_member_point: c.rewardAmount ?? 0,
      image_urls: c.images.map((img) => img.url),
      selected_members: [],
      create_at: c.createdAt.toISOString().slice(0, 16),
      update_at: c.updatedAt.toISOString().slice(0, 16),
    };
  }

  // 신청(필수 인증)
  async apply(expId: number, userId: number, pitchText?: string) {
    const exists = await this.prisma.campaignApplication.findFirst({
      where: { campaignId: expId, influencerUserId: userId },
    });
    if (!exists) {
      await this.prisma.campaignApplication.create({
        data: {
          campaignId: expId,
          influencerUserId: userId,
          status: 'PENDING',
          pitchText: pitchText,
        },
      });
    }
    return expId;
  }

  // 진행중 체험(필수 인증)
  async myProgress(userId: number) {
    const apps = await this.prisma.campaignApplication.findMany({
      where: { influencerUserId: userId },
      include: {
        campaign: true,
        submissions: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });
    return apps
      .filter(
        (a) =>
          a.status === 'PENDING' ||
          (a.status === 'APPROVED' && a.submissions[0]?.status !== 'APPROVED'),
      )
      .map((a) => ({
        exp_id: a.campaignId,
        title: a.campaign.title,
        schedule: a.campaign.applyStartAt.toISOString().slice(0, 10),
        process_status:
          a.status === 'PENDING'
            ? 1
            : a.submissions[0]?.status === 'REJECTED'
              ? 3
              : 2, // 1: 신청중, 2: 리뷰진행, 3: 반려
      }));
  }

  // 지난 체험(필수 인증)
  async myPast(userId: number) {
    const apps = await this.prisma.campaignApplication.findMany({
      where: { influencerUserId: userId },
      include: {
        campaign: true,
        submissions: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });
    return apps
      .filter(
        (a) =>
          ['REJECTED', 'CANCELLED'].includes(a.status) ||
          (a.status === 'APPROVED' && a.submissions[0]?.status === 'APPROVED'),
      )
      .map((a) => ({
        exp_id: a.campaignId,
        title: a.campaign.title,
        schedule: a.campaign.applyStartAt.toISOString().slice(0, 10),
        process_status:
          a.status === 'REJECTED' ? 4 : a.status === 'CANCELLED' ? 5 : 6, // 4: 거절, 5: 취소, 6: 완료
      }));
  }

  async listMyReviews(userId: number): Promise<MyReviewItemDto[]> {
    const submissions = await this.prisma.campaignSubmission.findMany({
      where: {
        application: {
          influencerUserId: userId,
        },
      },
      include: {
        application: {
          include: {
            campaign: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return submissions.map((sub) => ({
      campaignId: sub.application.campaign.id,
      campaignTitle: sub.application.campaign.title,
      reviewId: sub.id,
      reviewMessage: sub.note ?? undefined,
      reviewUrls: sub.urls ?? [],
      submittedAt: sub.createdAt,
    }));
  }

  // 리뷰 작성(필수 인증)
  async postReview(expId: number, userId: number, dto: PostReviewDto) {
    const app = await this.prisma.campaignApplication.findFirst({
      where: { campaignId: expId, influencerUserId: userId },
    });
    if (!app || app.status !== 'APPROVED')
      throw new ForbiddenException('리뷰를 작성할 권한이 없습니다.');

    await this.prisma.campaignSubmission.create({
      data: { applicationId: app.id, urls: dto.urls, note: dto.message },
    });
  }

  // 리뷰 삭제(필수 인증)
  async deleteReview(expId: number, reviewId: number, userId: number) {
    const submission = await this.prisma.campaignSubmission.findUnique({
      where: { id: reviewId },
      include: { application: true },
    });
    if (!submission || submission.application.campaignId !== expId)
      throw new NotFoundException('리뷰를 찾을 수 없습니다.');
    const app = submission.application;
    if (app.influencerUserId !== userId)
      throw new ForbiddenException('본인 리뷰만 삭제할 수 있습니다.');
    await this.prisma.campaignSubmission.delete({ where: { id: reviewId } });
  }

  // 신청 취소(필수 인증)
  async cancelApplication(expId: number, userId: number) {
    const app = await this.prisma.campaignApplication.findFirst({
      where: { campaignId: expId, influencerUserId: userId },
    });
    if (!app) throw new NotFoundException('신청 내역이 없습니다.');
    if ((app.status as any) === 'APPROVED')
      throw new ForbiddenException('선정 이후에는 취소할 수 없습니다.');
    await this.prisma.campaignApplication.delete({ where: { id: app.id } });
  }
}
