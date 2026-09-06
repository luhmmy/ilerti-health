import { NextResponse } from 'next/server';
import { serverDb, ServerUser, ServerDoctor } from '@/lib/serverDb';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const rl = checkRateLimit(`google_auth_${clientIp}`, { limit: 15, windowSeconds: 60 });
    
    if (!rl.success) {
      return NextResponse.json(
        { message: `Too many Google sign-in attempts. Please wait ${rl.resetSeconds} seconds.` },
        { status: 429, headers: { 'Retry-After': String(rl.resetSeconds) } }
      );
    }

    const data = await req.json();
    let email = (data.email || '').toLowerCase().trim();
    let name = data.name?.trim() || '';
    let avatarUrl = data.avatarUrl || data.picture || '';

    // 1. If Google ID Token / Credential is provided, verify with Google API in real time
    if (data.idToken || data.credential) {
      const tokenToVerify = data.idToken || data.credential;
      try {
        const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokenToVerify)}`);
        if (googleRes.ok) {
          const googleData = await googleRes.json();
          if (googleData.email) {
            email = googleData.email.toLowerCase().trim();
            name = googleData.name || name || email.split('@')[0];
            avatarUrl = googleData.picture || avatarUrl;
          }
        }
      } catch (gErr) {
        console.warn('Google tokeninfo verification network warning:', gErr);
      }
    }

    // 2. If Google OAuth Access Token is provided, query Google Userinfo API in real time
    if (data.accessToken && !email) {
      try {
        const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });
        if (userinfoRes.ok) {
          const uData = await userinfoRes.json();
          if (uData.email) {
            email = uData.email.toLowerCase().trim();
            name = uData.name || name || email.split('@')[0];
            avatarUrl = uData.picture || avatarUrl;
          }
        }
      } catch (uErr) {
        console.warn('Google userinfo API network warning:', uErr);
      }
    }

    if (!email) {
      return NextResponse.json(
        { message: 'Valid Google email address or Google credential token is required' },
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
      if (!firstName && name) {
        const parts = name.split(' ');
        firstName = parts[0] || 'User';
        lastName = parts.slice(1).join(' ') || '';
      }
      if (!firstName) firstName = 'Google User';

      const fullName = name || `${firstName} ${lastName}`.trim();
      const finalAvatar = avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0D9488&color=fff`;

      user = {
        id: userId,
        email,
        phone: data.phone?.trim() || '',
        passwordHash: 'GOOGLE_OAUTH_AUTHENTICATED',
        firstName,
        lastName,
        name: isDoctor ? (fullName.startsWith('Dr.') ? fullName : `Dr. ${fullName}`) : fullName,
        role,
        avatarUrl: finalAvatar,
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
    } else {
      // User already exists, ensure emailVerified is true
      if (!user.emailVerified) {
        user.emailVerified = true;
        await serverDb.saveUser(user);
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
