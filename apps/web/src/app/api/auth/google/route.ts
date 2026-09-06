import { NextResponse } from 'next/server';
import { serverDb, ServerUser, ServerDoctor } from '@/lib/serverDb';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const email = (data.email || '').toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { message: 'Email from Google authentication is required' },
        { status: 400 }
      );
    }

    let user = await serverDb.getUser(email);

    if (!user) {
      const isDoctor = data.isDoctor || (data.role || '').toUpperCase() === 'DOCTOR' || data.role === 'doctor';
      const role = isDoctor ? 'doctor' : 'patient';
      const userId = isDoctor ? `dr-${Date.now()}` : `u-${Date.now()}`;
      
      let firstName = data.firstName?.trim() || '';
      let lastName = data.lastName?.trim() || '';
      if (!firstName && data.name) {
        const parts = data.name.trim().split(' ');
        firstName = parts[0] || 'User';
        lastName = parts.slice(1).join(' ') || '';
      }
      if (!firstName) firstName = 'Google User';

      const fullName = data.name?.trim() || `${firstName} ${lastName}`.trim();

      user = {
        id: userId,
        email,
        phone: data.phone?.trim() || '',
        passwordHash: 'GOOGLE_OAUTH_AUTHENTICATED',
        firstName,
        lastName,
        name: isDoctor ? (fullName.startsWith('Dr.') ? fullName : `Dr. ${fullName}`) : fullName,
        role,
        avatarUrl: data.avatarUrl || data.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0D9488&color=fff`,
        specialty: data.specialty || (isDoctor ? 'General Practice' : undefined),
        mdcnFolio: data.mdcnFolio || (isDoctor ? 'MDCN/2026/00000' : undefined),
        hospitalAffiliation: data.hospitalAffiliation || '',
        stateOfPractice: data.stateOfPractice || 'Lagos',
        cityOfPractice: data.cityOfPractice || 'Lagos',
        consultationFee: isDoctor ? 10000 : undefined,
        verificationStatus: isDoctor ? 'PENDING' : 'VERIFIED',
        languages: ['English'],
        bio: isDoctor ? 'Licensed medical practitioner on ILERTI Health.' : '',
        isAvailable: true,
        emailVerified: true,
        phoneVerified: false,
        createdAt: new Date().toISOString(),
      };

      await serverDb.saveUser(user);

      if (isDoctor) {
        const doctorRecord: ServerDoctor = {
          id: userId,
          userId: userId,
          fullName: user.name,
          mdcnFolio: user.mdcnFolio || 'MDCN/2026/00000',
          primarySpecialty: user.specialty || 'General Practice',
          hospitalAffiliation: user.hospitalAffiliation || 'Private Practice',
          stateOfPractice: user.stateOfPractice || 'Lagos',
          cityOfPractice: user.cityOfPractice || 'Lagos',
          consultationFee: 10000,
          languages: ['English'],
          bio: user.bio || 'Verified medical doctor on ILERTI Health.',
          status: 'pending',
          isAvailable: true,
          createdAt: new Date().toISOString(),
        };
        await serverDb.saveDoctor(doctorRecord);
      }
    }

    const token = serverDb.signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        specialty: user.specialty,
        mdcnFolio: user.mdcnFolio,
        hospitalAffiliation: user.hospitalAffiliation,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Google authentication failed' },
      { status: 500 }
    );
  }
}
