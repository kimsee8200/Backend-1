import { Body, Controller, Get, Post, Query, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import { LicenceCodeService } from '../service/licence-code.service';
import { SendCodeDto } from '../dto/send-code.dto';
import { ApiSuccess } from '../../common/decorators/api-success';
import { SuccessResponseDto } from '../../common/dto/success-response.dto';
import { SendCodeResponseDto } from '../dto/send-code-response.dto';
import { ValidateCodeResponseDto } from '../dto/validate-code-response.dto';

@ApiTags('licence-code')
@ApiExtraModels(
  SuccessResponseDto,
  SendCodeResponseDto,
  ValidateCodeResponseDto,
)
@Controller('licence-code')
export class LicenceCodeController {
  constructor(private readonly licenceCodeService: LicenceCodeService) {}

  @ApiOperation({
    summary: '인증 코드 전송',
    description: '이메일로 인증 코드를 전송합니다.',
  })
  @ApiParam({
    name: 'email',
    description: '인증 코드를 받을 이메일 주소',
    example: 'user@example.com',
  })
  @ApiResponse({ status: 200, description: '인증 코드 전송 성공' })
  @ApiResponse({ status: 400, description: '잘못된 이메일 형식' })
  @ApiSuccess(SendCodeResponseDto)
  @Get('generate/:email')
  async sendLicenceCode(
    @Param('email') email: string,
  ): Promise<SendCodeResponseDto> {
    await this.licenceCodeService.sendLicenceCode(email);
    return { sent: true, email };
  }

  @ApiOperation({
    summary: '인증 코드 검증',
    description: '이메일과 인증 코드를 검증합니다.',
  })
  @ApiBody({ type: SendCodeDto })
  @ApiResponse({ status: 200, description: '인증 코드 검증 결과' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @ApiSuccess(ValidateCodeResponseDto)
  @Post('validate')
  async validateLicenceCode(
    @Body() body: SendCodeDto,
  ): Promise<ValidateCodeResponseDto> {
    const isValid = await this.licenceCodeService.validateLicenceCode(
      body.email,
      body.code,
    );
    return {
      valid: isValid,
      message: isValid
        ? '인증 코드가 유효합니다.'
        : '인증 코드가 유효하지 않습니다.',
    };
  }
}
