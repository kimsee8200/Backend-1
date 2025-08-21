import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { NoticeController } from '../notice/controller/notice.controller';
import { EventController } from '../event/controller/event.controller';
import { EventService } from '../service/event.service';
import { NoticeService } from '../service/notice.service';

@Module({
  imports: [PrismaModule],
  controllers: [NoticeController, EventController],
  providers: [EventService, NoticeService],
})
export class NoticeEventModule {}
