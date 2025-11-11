import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  // Event
  async createEvent(title: string, content: string, imageUrls: string[]) {
    return this.prisma.event.create({
      data: {
        title,
        content,
        images: {
          create: imageUrls.map((url, idx) => ({ url, sortOrder: idx })),
        },
      },
      include: { images: true },
    });
  }

  async updateEvent(
    id: number,
    title?: string,
    content?: string,
    imageUrls?: string[],
  ) {
    const data: any = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;

    await this.prisma.event.update({ where: { id }, data });

    if (imageUrls) {
      await this.prisma.eventImage.deleteMany({ where: { eventId: id } });
      if (imageUrls.length) {
        await this.prisma.eventImage.createMany({
          data: imageUrls.map((url, idx) => ({
            eventId: id,
            url,
            sortOrder: idx,
          })),
        });
      }
    }
    return this.findEvent(id);
  }

  async deleteEvent(id: number) {
    await this.prisma.event.delete({ where: { id } });
    return { deleted: true };
  }

  async findEvent(id: number) {
    const e = await this.prisma.event.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!e) throw new NotFoundException('이벤트를 찾을 수 없습니다.');
    return e;
  }

  async listEvent() {
    return this.prisma.event.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
