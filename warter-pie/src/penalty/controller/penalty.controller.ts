import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { PenaltyService } from '../service/penalty.service';
import { ApplyPenaltyDto } from '../dto/apply-penalty.dto';
import { JwtAuthGuard } from '../../auth/passport/jwt/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { CurrentUser } from '../../user/decorators/current-user.decorator';
import { CurrentUserPayload } from '../../user/decorators/current-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PenaltyResponseDto } from '../dto/penalty-response.dto';
import { PenaltyCountDto } from '../dto/penalty-count.dto';

@ApiTags('Penalties')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('penalties')
export class PenaltyController {
  constructor(private readonly penaltyService: PenaltyService) {}

  // Admin Endpoints
  @Post('apply')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Apply a penalty to a user (Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Penalty applied successfully.',
    type: PenaltyResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin only).' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async applyPenalty(@Body() applyPenaltyDto: ApplyPenaltyDto) {
    return this.penaltyService.applyPenalty(applyPenaltyDto);
  }

  @Get('user/:userId')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all penalties for a specific user (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'List of penalties for the user.',
    type: [PenaltyResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin only).' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getPenaltiesForUserAdmin(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.penaltyService.getPenaltiesForUser(userId);
  }

  @Get('user/:userId/count')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get penalty count for a specific user (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Penalty count for the user.',
    type: PenaltyCountDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin only).' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getPenaltyCountForUserAdmin(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    const count = await this.penaltyService.getPenaltyCountForUser(userId);
    return { count };
  }

  @Delete(':penaltyId')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content for successful deletion
  @ApiOperation({ summary: 'Cancel/Delete a specific penalty (Admin)' })
  @ApiResponse({
    status: 204,
    description: 'Penalty successfully cancelled/deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin only).' })
  @ApiResponse({ status: 404, description: 'Penalty not found.' })
  async cancelPenalty(@Param('penaltyId', ParseIntPipe) penaltyId: number) {
    await this.penaltyService.cancelPenalty(penaltyId);
  }

  // User Endpoints (for current user)
  @Get('me')
  @ApiOperation({ summary: "Get current user's penalties" })
  @ApiResponse({
    status: 200,
    description: 'List of penalties for the current user.',
    type: [PenaltyResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getMyPenalties(@CurrentUser() user: CurrentUserPayload) {
    return this.penaltyService.getPenaltiesForUser(user.userId);
  }

  @Get('me/count')
  @ApiOperation({ summary: "Get current user's penalty count" })
  @ApiResponse({
    status: 200,
    description: 'Penalty count for the current user.',
    type: PenaltyCountDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getMyPenaltyCount(@CurrentUser() user: CurrentUserPayload) {
    const count = await this.penaltyService.getPenaltyCountForUser(user.userId);
    return { count };
  }
}
