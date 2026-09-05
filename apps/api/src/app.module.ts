import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { AiModule } from './modules/ai/ai.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { FacilitiesModule } from './modules/facilities/facilities.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';
import { WellnessModule } from './modules/wellness/wellness.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20, // Rate limit: max 20 requests per minute per IP
    }),
    PrismaModule,
    AuthModule,
    AiModule,
    DoctorsModule,
    FacilitiesModule,
    ConsultationsModule,
    WellnessModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
