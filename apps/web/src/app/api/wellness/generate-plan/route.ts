import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const goal = body.goal || 'General Health & Vitality';

    const plan = {
      planType: goal,
      dailySchedule: [
        { time: '07:30 AM', activity: 'Hydration & Breakfast', detail: 'Warm water with lemon + Akara (bean cakes) with oat porridge' },
        { time: '10:00 AM', activity: 'Mid-Morning Water Break', detail: 'Drink 500ml water + handful of roasted groundnuts or garden egg' },
        { time: '01:00 PM', activity: 'Balanced Nigerian Lunch', detail: 'Grilled tilapia fish with vegetable Efo Riro and a portion of brown rice or ripe plantain' },
        { time: '04:00 PM', activity: 'Light Movement & Posture', detail: '15-minute brisk walk or stretching' },
        { time: '07:00 PM', activity: 'Wholesome Dinner', detail: 'Light vegetable soup with lean chicken breast' },
        { time: '09:30 PM', activity: 'Sleep Wind-Down', detail: 'Herbal chamomile / zobo tea and screen-free meditation' },
      ],
      weeklyGoals: {
        hydrationLitersPerDay: 2.5,
        stepsTarget: 8000,
        mindfulMomentsPerWeek: 5,
      },
    };

    return NextResponse.json(plan);
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to generate plan' },
      { status: 500 }
    );
  }
}
