import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('consultations')
@UseGuards(JwtAuthGuard)
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  bookConsultation(@CurrentUser() user: any, @Body() body: any) {
    return this.consultationsService.bookConsultation(user.userId, body);
  }

  @Get('my')
  findMyConsultations(@CurrentUser() user: any) {
    return this.consultationsService.findMyConsultations(user.userId, user.role);
  }
}
