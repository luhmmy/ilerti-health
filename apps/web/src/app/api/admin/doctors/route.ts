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
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const doctors = await serverDb.getAllDoctors();
    return NextResponse.json({
      success: true,
      doctors,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = serverDb.verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const body = await req.json();
    const { doctorId, action } = body; // action: 'verify' | 'reject'

    if (!doctorId || !action) {
      return NextResponse.json(
        { message: 'doctorId and action are required' },
        { status: 400 }
      );
    }

    const newStatus = action === 'verify' ? 'verified' : 'rejected';
    await serverDb.updateDoctorStatus(doctorId, newStatus);

    return NextResponse.json({
      success: true,
      message: `Doctor ${doctorId} status updated to ${newStatus}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Doctor status update failed' },
      { status: 500 }
    );
  }
}
