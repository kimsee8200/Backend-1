import { MailerService } from '@nestjs-modules/mailer/dist/mailer.service';
import { Injectable, Logger } from '@nestjs/common';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Injectable()
export class LicenceCodeService {
  private codes: Set<[string, string]> = new Set();
  private readonly logger = new Logger(LicenceCodeService.name);

  constructor(private readonly mailerService: MailerService) {}

  private async generateLicenceCode(email: string): Promise<string> {
    // Check if a licence code already exists for the email
    const entry = Array.from(this.codes).find(([e]) => e === email);
    if (entry) {
      this.codes.delete(entry);
    }

    // Logic to generate a unique licence code
    const licenceCode = Math.random()
      .toString(36)
      .substring(2, 15)
      .toUpperCase();
    this.codes.add([email, licenceCode]);
    return licenceCode;
  }

  async validateLicenceCode(
    email: string,
    licenceCode: string,
  ): Promise<boolean> {
    // Logic to validate the licence code
    const codeEntry = Array.from(this.codes).find(
      ([e, c]) => e === email && c === licenceCode,
    );
    if (codeEntry) {
      this.codes.delete(codeEntry); // Optionally remove the code after validation
    }
    return !!codeEntry;
  }

  async sendLicenceCode(email: string): Promise<void> {
    try {
      const licenceCode = await this.generateLicenceCode(email);

      // 개발 환경에서는 이메일 전송을 건너뛰고 콘솔에 출력
      if (!process.env.MAIL_PASS) {
        this.logger.log(
          `[개발 모드] 인증 코드가 생성되었습니다: ${licenceCode}`,
        );
        this.logger.log(`[개발 모드] 이메일: ${email}`);
        return;
      }

      await this.mailerService.sendMail({
        to: email,
        subject: 'warter-pie 인증 코드',
        text: `인증코드: ${licenceCode}`,
        html: `<p>인증코드: <strong>${licenceCode}</strong></p>`,
      });
      this.logger.log(`인증 코드가 ${email}로 전송되었습니다.`);
    } catch (error) {
      this.logger.error(`이메일 전송 실패: ${error.message}`);
      // 이메일 전송 실패 시에도 인증 코드는 생성되도록 함
      throw new Error(
        '이메일 전송에 실패했습니다. 앱 비밀번호를 확인해주세요.',
      );
    }
  }
}
