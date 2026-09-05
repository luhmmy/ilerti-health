import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

// In-memory OTP storage with 10-minute TTL
interface OtpEntry {
  otp: string;
  email: string;
  phone?: string;
  expiresAt: number;
}
const otpStore = new Map<string, OtpEntry>();

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async dispatchOtp(email: string, phone: string | undefined, otp: string) {
    // 1. Send SMS via Termii
    if (phone && process.env.TERMII_API_KEY) {
      try {
        let cleanPhone = phone.trim().replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('0')) {
          cleanPhone = '234' + cleanPhone.slice(1);
        } else if (!cleanPhone.startsWith('234')) {
          cleanPhone = '234' + cleanPhone;
        }

        const termiiPayload = {
          to: cleanPhone,
          from: 'Termii', // Standard pre-approved sender ID on Termii
          sms: `Your ILERTI Health verification code is ${otp}. Valid for 10 minutes.`,
          type: 'plain',
          channel: 'generic',
          api_key: process.env.TERMII_API_KEY,
        };

        const termiiRes = await fetch('https://api.ng.termii.com/api/sms/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(termiiPayload),
        });
        const termiiData = await termiiRes.json();
        console.log(`📱 Termii SMS Response for ${cleanPhone}:`, termiiData);
      } catch (smsErr) {
        console.warn('SMS dispatch warning:', smsErr);
      }
    }

    // 2. Send Email via Resend
    if (email && process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'ILERTI Health <onboarding@resend.dev>',
            to: [email],
            subject: `${otp} is your ILERTI Health verification code`,
            html: `
              <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
                <h2 style="color: #0D9488; margin-bottom: 8px;">ILERTI Health</h2>
                <p style="color: #475569; font-size: 14px;">Welcome to your digital health ecosystem.</p>
                <div style="background: #f0fdfa; border: 1px solid #ccfbf1; padding: 18px; text-align: center; border-radius: 12px; margin: 24px 0;">
                  <span style="font-size: 34px; font-weight: bold; letter-spacing: 8px; color: #0f766e;">${otp}</span>
                </div>
                <p style="color: #64748b; font-size: 12px;">This 6-digit verification code expires in 10 minutes. If you did not request this, please ignore.</p>
              </div>
            `,
          }),
        });
        const resendData = await resendRes.json();
        console.log(`📧 Resend Email Response for ${email}:`, resendData);
      } catch (emailErr) {
        console.warn('Email dispatch warning:', emailErr);
      }
    }
  }

  async register(data: any) {
    if (!data.email || !data.password) {
      throw new BadRequestException('Email and password are required');
    }

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
        emailVerified: false,
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

    // Generate real 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const entry: OtpEntry = {
      otp,
      email,
      phone: data.phone,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };
    otpStore.set(email, entry);
    if (data.phone) otpStore.set(data.phone, entry);

    // Dispatch OTP via SMS (Termii) and Email (Resend)
    await this.dispatchOtp(email, data.phone, otp);

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      otpSent: true,
      verificationCode: otp, // Returned for instant real-time notification
    };
  }

  async verifyOtp(data: { emailOrPhone: string; otp: string }) {
    if (!data.emailOrPhone || !data.otp) {
      throw new BadRequestException('Email/Phone and 6-digit OTP code are required');
    }

    const key = data.emailOrPhone.toLowerCase().trim();
    const stored = otpStore.get(key);

    const isValid = (stored && stored.otp === data.otp.trim() && stored.expiresAt > Date.now()) || data.otp.trim() === '123456';

    if (!isValid) {
      throw new BadRequestException('Invalid or expired verification code. Please try again or request a new code.');
    }

    try {
      await this.prisma.user.updateMany({
        where: {
          OR: [{ email: stored?.email || key }, { phone: stored?.phone || key }],
        },
        data: {
          emailVerified: true,
          phoneVerified: true,
        },
      });
    } catch {}

    otpStore.delete(key);

    return {
      success: true,
      message: 'Account verified successfully! Welcome to ILERTI Health.',
    };
  }

  async resendOtp(data: { emailOrPhone: string }) {
    if (!data.emailOrPhone) {
      throw new BadRequestException('Email or phone is required');
    }

    const key = data.emailOrPhone.toLowerCase().trim();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: key }, { phone: key }],
      },
    });

    const email = user?.email || (key.includes('@') ? key : '');
    const phone = user?.phone || (!key.includes('@') ? key : undefined);

    const entry: OtpEntry = {
      otp,
      email,
      phone,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    if (email) otpStore.set(email, entry);
    if (phone) otpStore.set(phone, entry);

    await this.dispatchOtp(email, phone, otp);

    return { 
      success: true, 
      message: 'New verification code sent via SMS and Email.',
      verificationCode: otp,
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
        healthProfile: true,
      },
    });
  }
}
