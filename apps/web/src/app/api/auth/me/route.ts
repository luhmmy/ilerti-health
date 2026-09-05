import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = serverDb.verifyToken(token);

    if (!decoded || !decoded.email) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    const user = serverDb.users.get(decoded.email);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      specialty: user.specialty,
      mdcnFolio: user.mdcnFolio,
      hospitalAffiliation: user.hospitalAffiliation,
      verificationStatus: user.verificationStatus,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Unauthorized' },
      { status: 401 }
    );
  }
}
