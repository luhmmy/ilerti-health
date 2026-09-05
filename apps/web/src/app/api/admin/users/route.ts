import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';

export async function GET() {
  try {
    const users = await serverDb.getAllUsers();
    
    const mapped = users.map((u) => {
      let status: 'active' | 'suspended' | 'banned' = 'active';
      const vStatus = (u.verificationStatus || '').toUpperCase();
      if (vStatus === 'BANNED') status = 'banned';
      else if (vStatus === 'SUSPENDED') status = 'suspended';

      return {
        id: u.id,
        fullName: u.name,
        email: u.email,
        phone: u.phone || '',
        role: u.role,
        status,
        registeredAt: u.createdAt ? u.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        location: `${u.cityOfPractice || 'Lagos'}, Nigeria`,
        mdcnFolio: u.mdcnFolio,
        specialty: u.specialty,
        consultationsCount: 0,
      };
    });

    return NextResponse.json({
      success: true,
      users: mapped,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, userId, reason, suspendDays } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { message: 'userId and action are required' },
        { status: 400 }
      );
    }

    if (action === 'ban') {
      await serverDb.updateUserStatus(userId, 'BANNED', reason);
    } else if (action === 'suspend') {
      const suspendedUntil = new Date(Date.now() + (suspendDays || 14) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      await serverDb.updateUserStatus(userId, 'SUSPENDED', reason, suspendedUntil);
    } else if (action === 'restore') {
      await serverDb.updateUserStatus(userId, 'ACTIVE');
    } else if (action === 'delete') {
      await serverDb.deleteUser(userId);
    }

    return NextResponse.json({
      success: true,
      message: `User action ${action} executed successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Moderation action failed' },
      { status: 500 }
    );
  }
}
