import { Module } from '@nestjs/common';
import { LicenceCodeController } from '../controller/licence-code.controller';
import { LicenceCodeService } from '../service/licence-code.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [MailerModule.forRootAsync({
      useFactory: () => ({
      transport: {
        host: 'smtp.naver.com',
        port: 587,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: `"No Reply" <${process.env.MAIL_USER}>`,
      },
    })
  })],
  exports: [MailerModule],
  controllers: [LicenceCodeController],
  providers: [LicenceCodeService]
})
export class LicenceCodeModule {}
