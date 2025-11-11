import { Module } from '@nestjs/common';
import { ExperienceManageController } from '../controller/experience-manage.controller';
import { ExperienceManageService } from '../service/experience-manage.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { PenaltyModule } from '../../penalty/module/penalty.module';
import { ImageUploadModule } from '../../image-upload/image-upload.module';

@Module({
  imports: [PrismaModule, PenaltyModule, ImageUploadModule],
  controllers: [ExperienceManageController],
  providers: [ExperienceManageService],
})
export class ExperienceManageModule {}
