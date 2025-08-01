import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/module/auth.module';
import { UserModule } from './user/module/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { LicenceCodeModule } from './licence-code/module/licence-code.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, LicenceCodeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

