import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInquiryDto } from '../dto/create-inquiry.dto';
import { UpdateInquiryDto } from '../dto/update-inquiry.dto';
import { AnswerInquiryDto } from '../dto/answer-inquiry.dto';
import { Inquiry, User } from '@prisma/client';
import { CurrentUserPayload } from '../../user/decorators/current-user.decorator';

@Injectable()
export class InquiryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createInquiryDto: CreateInquiryDto,
    user: CurrentUserPayload,
  ): Promise<Inquiry> {
    return this.prisma.inquiry.create({
      data: {
        ...createInquiryDto,
        author: {
          connect: { id: user.userId, email: user.email },
        },
      },
    });
  }

  async findAllForUser(user: CurrentUserPayload): Promise<Inquiry[]> {
    return this.prisma.inquiry.findMany({
      where: { authorId: user.userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForUser(id: number, user: CurrentUserPayload): Promise<Inquiry> {
    const inquiry = await this.prisma.inquiry.findUnique({ where: { id: id } });
    if (!inquiry) {
      throw new NotFoundException(`Inquiry with ID ${id} not found.`);
    }
    console.log(inquiry);
    console.log(user.userId);
    if (inquiry.authorId != user.userId) {
      // A non-admin should not know about the existence of other's inquiries
      throw new ForbiddenException(`no writer with ID ${id} not found.`);
    }
    return inquiry;
  }

  async update(
    id: number,
    updateInquiryDto: UpdateInquiryDto,
    user: CurrentUserPayload,
  ): Promise<Inquiry> {
    await this.findOneForUser(id, user); // leverages existing ownership check
    return this.prisma.inquiry.update({
      where: { id },
      data: updateInquiryDto,
    });
  }

  async remove(id: number, user: CurrentUserPayload): Promise<void> {
    await this.findOneForUser(id, user); // leverages existing ownership check
    await this.prisma.inquiry.delete({ where: { id } });
  }

  // Admin methods
  async findAllForAdmin(): Promise<Inquiry[]> {
    return this.prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForAdmin(id: number): Promise<Inquiry> {
    const inquiry = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) {
      throw new NotFoundException(`Inquiry with ID ${id} not found.`);
    }
    return inquiry;
  }

  async answer(
    id: number,
    answerInquiryDto: AnswerInquiryDto,
  ): Promise<Inquiry> {
    await this.findOneForAdmin(id); // check existence
    return this.prisma.inquiry.update({
      where: { id },
      data: {
        ...answerInquiryDto,
        status: 'ANSWERED',
      },
    });
  }

  async cancelAnswer(id: number): Promise<Inquiry> {
    const inquiry = await this.findOneForAdmin(id); // Re-use existing check
    if (inquiry.status !== 'ANSWERED') {
      throw new BadRequestException(
        `Inquiry with ID ${id} is not currently answered.`,
      );
    }
    return this.prisma.inquiry.update({
      where: { id },
      data: {
        answer: null,
        status: 'PENDING',
      },
    });
  }
}
