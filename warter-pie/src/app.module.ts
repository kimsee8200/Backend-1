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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { InquiryModule } from './inquiry/module/inquiry.module';
import { PenaltyModule } from './penalty/module/penalty.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './payment/module/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    LicenceCodeModule,
    ExperienceManageModule,
    ExperienceModule,
    NoticeEventModule,
    InquiryModule,
    PenaltyModule,
    SchedulerModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
