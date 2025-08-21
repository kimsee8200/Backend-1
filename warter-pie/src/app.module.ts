import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/module/auth.module';
import { UserModule } from './user/module/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { LicenceCodeModule } from './licence-code/module/licence-code.module';
import { ExperienceManageModule } from './experience-manage/module/experience-manage.module';
import { ExperienceModule } from './experience/module/experience.module';
import { NoticeEventModule } from './notice-event/module/notice-event.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    LicenceCodeModule,
    ExperienceManageModule,
    ExperienceModule,
    NoticeEventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
