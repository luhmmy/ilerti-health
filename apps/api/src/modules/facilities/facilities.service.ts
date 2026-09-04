import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FacilitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { state, city, type } = query;
    
    const where: any = { verificationStatus: 'VERIFIED' };
    
    if (state) where.state = state;
    if (city) where.city = city;
    if (type) where.type = type;

    return this.prisma.facility.findMany({
      where,
    });
  }

  async findOne(id: string) {
    const facility = await this.prisma.facility.findUnique({
      where: { id },
    });

    if (!facility) {
      throw new NotFoundException('Facility not found');
    }
    
    return facility;
  }
}
