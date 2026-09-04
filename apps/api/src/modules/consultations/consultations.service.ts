import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConsultationsService {
  constructor(private prisma: PrismaService) {}

  async bookConsultation(userId: string, data: any) {
    // Validate doctor
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: data.doctorId }
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    if (!doctor.isAvailable) {
      throw new BadRequestException('Doctor is not currently available');
    }

    return this.prisma.consultation.create({
      data: {
        patientId: userId,
        doctorId: data.doctorId,
        type: data.type || 'VIDEO',
        status: 'SCHEDULED',
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        amountPaid: doctor.consultationFee,
        chiefComplaint: data.chiefComplaint,
        aiTriageSummary: data.aiTriageSummary,
        urgencyLevel: data.urgencyLevel,
      },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      }
    });
  }

  async findMyConsultations(userId: string, role: string) {
    const isDoctor = role === 'DOCTOR';
    
    if (isDoctor) {
      const doctorProfile = await this.prisma.doctor.findUnique({
        where: { userId }
      });
      
      if (!doctorProfile) {
        return [];
      }

      return this.prisma.consultation.findMany({
        where: { doctorId: doctorProfile.id },
        include: {
          patient: {
            select: {
              firstName: true,
              lastName: true,
              avatarUrl: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    return this.prisma.consultation.findMany({
      where: { patientId: userId },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
