import { Module } from '@nestjs/common';
import { ExperienceController } from '../controller/experience.controller';
import { ExperienceService } from '../service/experience.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExperienceController],
  providers: [ExperienceService],
  exports: [ExperienceService],
})
export class ExperienceModule {}
