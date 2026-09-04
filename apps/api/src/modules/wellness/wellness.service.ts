import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WellnessService {
  constructor(private prisma: PrismaService) {}

  async generatePlan(userId: string, data: any) {
    // In a real implementation, this would call AI or a complex rules engine
    // to generate a culturally appropriate Nigerian meal and lifestyle plan
    const mealSchedule = {
      monday: {
        breakfast: 'Oats with Peak milk and honey',
        lunch: 'Jollof rice with grilled chicken and plantain',
        dinner: 'Light pepper soup with a small slice of yam',
      },
      // Mock data for the rest...
    };

    const activityPlan = {
      daily: '30 mins brisk walking',
      weekly: '2 sessions of light aerobics or dancing to Afrobeats',
    };

    return this.prisma.wellnessPlan.create({
      data: {
        userId,
        planType: data.planType || 'GENERAL',
        name: data.name || 'My Wellness Plan',
        mealSchedule,
        activityPlan,
        reminders: { hydration: 'Drink 2.5L water daily' },
      }
    });
  }

  async getMyPlan(userId: string) {
    return this.prisma.wellnessPlan.findFirst({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
