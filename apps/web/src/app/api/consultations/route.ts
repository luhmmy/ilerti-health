import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = serverDb.verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = decoded.userId;

    let userConsults = (serverDb.consultations || []).filter(c => c.patientId === userId || c.doctorId === userId);
    
    // Admin can see all
    if (decoded.role === 'admin') {
       userConsults = serverDb.consultations || [];
    }

    return NextResponse.json(userConsults);
  } catch(e) {
    return NextResponse.json({message: 'Error fetching consultations'}, {status:500});
  }
}

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const rl = checkRateLimit(`consult_${clientIp}`, { limit: 10, windowSeconds: 60 });
    if (!rl.success) {
      return NextResponse.json({ message: 'Too many requests' }, { status: 429 });
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = serverDb.verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const data = await req.json();
    const newConsultation = {
      id: `c-${Date.now()}`,
      ...data,
      patientId: decoded.userId, // Force patientId to be the logged in user
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
    };

    serverDb.consultations.push(newConsultation);
    return NextResponse.json(newConsultation);
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to book consultation' },
      { status: 500 }
    );
  }
}
