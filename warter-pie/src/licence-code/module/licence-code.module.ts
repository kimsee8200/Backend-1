import { Module } from '@nestjs/common';
import { LicenceCodeController } from '../controller/licence-code.controller';
import { LicenceCodeService } from '../service/licence-code.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAIL_HOST,
          port: Number(process.env.MAIL_PORT),
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        },
        defaults: {
          from: `"No Reply" <${process.env.MAIL_USER}>`,
        },
      }),
    }),
  ],
  exports: [MailerModule],
  controllers: [LicenceCodeController],
  providers: [LicenceCodeService],
})
export class LicenceCodeModule {}
