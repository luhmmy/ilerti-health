import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }
  
  @Post('verify-otp')
  verifyOtp(@Body() body: any) {
    return this.authService.verifyOtp(body);
  }

  @Post('resend-otp')
  resendOtp(@Body() body: any) {
    return this.authService.resendOtp(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('wipe-database')
  wipeDatabase() {
    return this.authService.wipeDatabase();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: any) {
    return this.authService.getMe(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  updateProfile(@CurrentUser() user: any, @Body() body: any) {
    return this.authService.updateProfile(user.userId, body);
  }
}
