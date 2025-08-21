import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/login.dto';
import { LocalAuthGuard } from '../passport/local/local-auth.guard';
import { JwtAuthGuard } from '../passport/jwt/jwt-auth.guard';
import { Op, Ok, BadRequest, Unauthorized, RequireAuth } from '../../common/decorators/swagger.decorators';
import { ApiSuccess } from '../../common/decorators/api-success';
import { LoginResponseDto } from '../dto/login-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Op('로그인', '이메일과 비밀번호로 로그인합니다.')
  @Ok('로그인 성공')
  @Unauthorized('인증 실패')
  @UseGuards(LocalAuthGuard)
  @ApiSuccess(LoginResponseDto)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }
}
