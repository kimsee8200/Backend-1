import { Module } from '@nestjs/common';
import { ExperienceManageController } from '../controller/experience-manage.controller';
import { ExperienceManageService } from '../service/experience-manage.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExperienceManageController],
  providers: [ExperienceManageService],
})
export class ExperienceManageModule {}
