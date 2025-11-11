import { Module } from '@nestjs/common';
import { InquiryService } from '../service/inquiry.service';
import { InquiryController } from '../controller/inquiry.controller';
import { InquiryAdminController } from '../controller/inquiry.admin.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InquiryController, InquiryAdminController],
  providers: [InquiryService],
})
export class InquiryModule {}
