import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NoticeService {
  constructor(private readonly prisma: PrismaService) {}

  // Notice
  async createNotice(title: string, content: string, imageUrls: string[]) {
    return this.prisma.notice.create({
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

  async updateNotice(
    id: number,
    title?: string,
    content?: string,
    imageUrls?: string[],
  ) {
    const data: any = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;

    await this.prisma.notice.update({ where: { id }, data });

    if (imageUrls) {
      await this.prisma.noticeImage.deleteMany({ where: { noticeId: id } });
      if (imageUrls.length) {
        await this.prisma.noticeImage.createMany({
          data: imageUrls.map((url, idx) => ({
            noticeId: id,
            url,
            sortOrder: idx,
          })),
        });
      }
    }

    return this.findNotice(id);
  }

  async deleteNotice(id: number) {
    await this.prisma.notice.delete({ where: { id } });
    return { deleted: true };
  }

  async findNotice(id: number) {
    const n = await this.prisma.notice.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!n) throw new NotFoundException('공지사항을 찾을 수 없습니다.');
    return n;
  }

  async listNotice() {
    return this.prisma.notice.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
