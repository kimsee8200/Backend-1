import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApplyPenaltyDto } from '../dto/apply-penalty.dto';
import { Penalty } from '@prisma/client';

@Injectable()
export class PenaltyService {
  constructor(private readonly prisma: PrismaService) {}

  async applyPenalty(applyPenaltyDto: ApplyPenaltyDto): Promise<Penalty> {
    const { userId, reason } = applyPenaltyDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    return this.prisma.penalty.create({
      data: {
        userId,
        reason,
      },
    });
  }

  async getPenaltiesForUser(userId: number): Promise<Penalty[]> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    return this.prisma.penalty.findMany({
      where: { userId },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async getPenaltyCountForUser(userId: number): Promise<number> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    return this.prisma.penalty.count({
      where: { userId },
    });
  }

  async cancelPenalty(penaltyId: number): Promise<void> {
    const penalty = await this.prisma.penalty.findUnique({
      where: { id: penaltyId },
    });
    if (!penalty) {
      throw new NotFoundException(`Penalty with ID ${penaltyId} not found.`);
    }
    await this.prisma.penalty.delete({ where: { id: penaltyId } });
  }
}
