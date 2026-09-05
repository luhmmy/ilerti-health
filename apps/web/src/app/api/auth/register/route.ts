import { NextResponse } from 'next/server';
import { serverDb, ServerUser, ServerDoctor } from '@/lib/serverDb';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.email || !data.password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const email = data.email.toLowerCase().trim();

    // Check if user already exists
    if (serverDb.users.has(email)) {
      return NextResponse.json(
        { message: 'An account with this email already exists. Please sign in.' },
        { status: 400 }
      );
    }

    let firstName = data.firstName?.trim() || '';
    let lastName = data.lastName?.trim() || '';
    if (!firstName && data.fullName) {
      const parts = data.fullName.trim().split(' ');
      firstName = parts[0] || 'User';
      lastName = parts.slice(1).join(' ') || '';
    }
    if (!firstName) firstName = 'User';

    const fullName = `${firstName} ${lastName}`.trim();
    const isDoctor = data.isDoctor || (data.role || '').toUpperCase() === 'DOCTOR' || data.role === 'doctor';
    const role = isDoctor ? 'doctor' : 'patient';

    const passwordHash = await serverDb.hashPassword(data.password);
    const userId = isDoctor ? `dr-${Date.now()}` : `u-${Date.now()}`;

    const newUser: ServerUser = {
      id: userId,
      email,
      phone: data.phone?.trim(),
      passwordHash,
      firstName,
      lastName,
      name: isDoctor ? (fullName.startsWith('Dr.') ? fullName : `Dr. ${fullName}`) : fullName,
      role,
      specialty: data.primarySpecialty || (isDoctor ? 'General Practice' : undefined),
      mdcnFolio: data.mdcnFolio?.trim(),
      hospitalAffiliation: data.hospitalAffiliation?.trim(),
      stateOfPractice: data.stateOfPractice || 'Lagos',
      cityOfPractice: data.cityOfPractice || 'Lagos',
      consultationFee: data.consultationFee ? Number(data.consultationFee) : 10000,
      languages: data.languages || ['English'],
      bio: data.bio?.trim() || '',
      verificationStatus: isDoctor ? 'PENDING' : 'VERIFIED',
      isAvailable: true,
      emailVerified: false,
      phoneVerified: false,
      createdAt: new Date().toISOString(),
    };

    serverDb.users.set(email, newUser);
    if (data.phone) {
      serverDb.users.set(data.phone.trim(), newUser);
    }

    if (isDoctor) {
      const doctorRecord: ServerDoctor = {
        id: userId,
        userId: userId,
        fullName: newUser.name,
        mdcnFolio: newUser.mdcnFolio || 'MDCN/2026/00000',
        primarySpecialty: newUser.specialty || 'General Practice',
        secondarySpecialty: data.secondarySpecialty,
        hospitalAffiliation: newUser.hospitalAffiliation || 'Private Practice',
        stateOfPractice: newUser.stateOfPractice || 'Lagos',
        cityOfPractice: newUser.cityOfPractice || 'Lagos',
        consultationFee: newUser.consultationFee || 10000,
        languages: newUser.languages || ['English'],
        bio: newUser.bio || 'Verified medical doctor on ILERTI Health.',
        status: 'pending',
        isAvailable: true,
        createdAt: new Date().toISOString(),
      };
      serverDb.doctors.set(userId, doctorRecord);
    }

    // Generate 6-digit verification code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    serverDb.otps.set(email, {
      code: otp,
      email,
      phone: data.phone,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    const token = serverDb.signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return NextResponse.json({
      success: true,
      access_token: token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        specialty: newUser.specialty,
        mdcnFolio: newUser.mdcnFolio,
        hospitalAffiliation: newUser.hospitalAffiliation,
        verificationStatus: newUser.verificationStatus,
      },
      otpSent: true,
      verificationCode: otp,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to register account' },
      { status: 500 }
    );
  }
}
