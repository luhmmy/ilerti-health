import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { WellnessService } from './wellness.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('wellness')
@UseGuards(JwtAuthGuard)
export class WellnessController {
  constructor(private readonly wellnessService: WellnessService) {}

  @Post('generate-plan')
  generatePlan(@CurrentUser() user: any, @Body() body: any) {
    return this.wellnessService.generatePlan(user.userId, body);
  }

  @Get('my-plan')
  getMyPlan(@CurrentUser() user: any) {
    return this.wellnessService.getMyPlan(user.userId);
  }
}
