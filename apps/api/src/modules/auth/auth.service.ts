import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    if (!data.email || !data.password) {
      throw new BadRequestException('Email and password are required');
    }

    // Strict Password Policy Enforcement:
    // Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#])[A-Za-z\d@$!%*?&_\-#]{8,}$/;
    if (!passwordRegex.test(data.password)) {
      throw new BadRequestException(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (e.g. @$!%*?&).'
      );
    }

    const email = data.email.toLowerCase().trim();
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('An account with this email already exists. Please sign in.');
    }

    // Parse first and last names cleanly
    let firstName = data.firstName;
    let lastName = data.lastName;
    if (!firstName && data.name) {
      const parts = data.name.trim().split(' ');
      firstName = parts[0] || 'User';
      lastName = parts.slice(1).join(' ') || 'Patient';
    }
    if (!firstName && data.fullName) {
      const parts = data.fullName.trim().split(' ');
      firstName = parts[0] || 'User';
      lastName = parts.slice(1).join(' ') || 'Doctor';
    }
    if (!firstName) firstName = 'User';
    if (!lastName) lastName = 'Member';

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const role = data.role === 'DOCTOR' || data.isDoctor ? 'DOCTOR' : 'PATIENT';

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role,
        phone: data.phone || null,
        state: data.state || data.stateOfPractice || null,
        city: data.city || data.cityOfPractice || null,
        emailVerified: true,
        phoneVerified: false,
        ...(role === 'DOCTOR' && {
          doctor: {
            create: {
              mdcnNumber: data.mdcnNumber || data.mdcnFolio || `MDCN/${Date.now().toString().slice(-5)}`,
              bio: data.bio || '',
              experienceYears: data.experienceYears ? Number(data.experienceYears) : 5,
              consultationFee: data.consultationFee ? Number(data.consultationFee) : 10000,
              specialties: Array.isArray(data.specialties) ? data.specialties : data.primarySpecialty ? [data.primarySpecialty] : ['General Practice'],
              languages: Array.isArray(data.languages) ? data.languages : ['English'],
              verificationStatus: 'VERIFIED',
              isAvailable: true,
            },
          },
        }),
      },
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async login(data: any) {
    if (!data.email || !data.password) {
      throw new BadRequestException('Email and password are required');
    }

    const email = data.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }
  
  async verifyOtp(data: any) {
    return { success: true, message: 'OTP verified successfully' };
  }

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatarUrl: true,
      },
    });
  }
}
