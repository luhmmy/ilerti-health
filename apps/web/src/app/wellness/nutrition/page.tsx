"use client";

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MealTimetablePlanner } from '@/components/wellness/MealTimetablePlanner';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function NutritionPage() {
  return (
    <AuthGuard
      serviceName="Nigerian Meal & Nutrition Planner"
      serviceDescription="To generate condition-specific Nigerian meal timetables, view budget breakdowns, and generate market grocery lists, please create an account or sign in."
    >
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-12">
          <MealTimetablePlanner />
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}

