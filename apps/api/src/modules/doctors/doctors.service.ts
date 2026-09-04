import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { specialty, state, language, isAvailable } = query;
    
    const where: any = { verificationStatus: 'VERIFIED' };
    
    if (specialty) {
      where.specialties = { has: specialty };
    }
    if (language) {
      where.languages = { has: language };
    }
    if (isAvailable !== undefined) {
      where.isAvailable = isAvailable === 'true';
    }
    if (state) {
      where.user = { state };
    }

    return this.prisma.doctor.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
            state: true,
            city: true,
          }
        }
      }
    });
  }

  async findOne(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
            state: true,
            city: true,
            email: true,
            phone: true,
          }
        }
      }
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    
    return doctor;
  }

  async onboard(userId: string, data: any) {
    // Update user role to DOCTOR
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'DOCTOR' }
    });

    return this.prisma.doctor.create({
      data: {
        userId,
        mdcnNumber: data.mdcnNumber,
        specialties: data.specialties || [],
        bio: data.bio,
        experienceYears: data.experienceYears,
        consultationFee: data.consultationFee,
        languages: data.languages || [],
        verificationStatus: 'UNDER_REVIEW',
      }
    });
  }
}
