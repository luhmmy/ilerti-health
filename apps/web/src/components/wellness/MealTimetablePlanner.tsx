"use client";

import React, { useState, useMemo } from "react";
import { 
  HEALTH_CONDITION_PROFILES, 
  HealthConditionKey, 
  generateWeeklyTimetable, 
  generateGroceryList,
  MealItem, 
  DaySchedule,
  NIGERIAN_MEAL_DATABASE
} from "@/data/nutrition";
import { 
  Utensils, 
  Calendar, 
  Wallet, 
  Sparkles, 
  Check, 
  ShoppingCart, 
  Printer, 
  RefreshCw, 
  ChevronRight, 
  Flame, 
  Info, 
  CheckCircle2, 
  Heart,
  Clock,
  Layers,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function MealTimetablePlanner() {
  const [selectedCondition, setSelectedCondition] = useState<HealthConditionKey>("general");
  const [budgetTier, setBudgetTier] = useState<"economy" | "standard" | "premium">("standard");
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [activeDay, setActiveDay] = useState<DaySchedule["day"]>("Monday");
  const [shoppingModalOpen, setShoppingModalOpen] = useState(false);
  const [swapModalMeal, setSwapModalMeal] = useState<{ day: string; meal: MealItem } | null>(null);
  const [checkedGrocery, setCheckedGrocery] = useState<Record<string, boolean>>({});

  // Generate 7-day schedule
  const [customTimetable, setCustomTimetable] = useState<DaySchedule[]>(() =>
    generateWeeklyTimetable(selectedCondition, budgetTier, period)
  );

  const conditionProfile = HEALTH_CONDITION_PROFILES[selectedCondition];

  // Regenerate when condition or budget changes
  const handleRegenerate = (cond = selectedCondition, tier = budgetTier, per = period) => {
    const updated = generateWeeklyTimetable(cond, tier, per);
    setCustomTimetable(updated);
    toast.success(`✨ Generated Nigerian Meal Timetable for ${HEALTH_CONDITION_PROFILES[cond].label}!`);
  };

  const handleConditionChange = (newCond: HealthConditionKey) => {
    setSelectedCondition(newCond);
    handleRegenerate(newCond, budgetTier, period);
  };

  const handleBudgetChange = (newTier: "economy" | "standard" | "premium") => {
    setBudgetTier(newTier);
    handleRegenerate(selectedCondition, newTier, period);
  };

  const handlePeriodChange = (newPeriod: "weekly" | "monthly") => {
    setPeriod(newPeriod);
    handleRegenerate(selectedCondition, budgetTier, newPeriod);
  };

  // Swap meal in timetable
  const handleSwapMeal = (dayName: string, oldMealId: string, newMeal: MealItem) => {
    setCustomTimetable((prev) =>
      prev.map((dayObj) => {
        if (dayObj.day !== dayName) return dayObj;
        const updatedMeals = dayObj.meals.map((m) => (m.id === oldMealId ? { ...newMeal, time: m.time } : m));
        const totalCalories = updatedMeals.reduce((sum, m) => sum + m.calories, 0);
        const totalCostNgn = updatedMeals.reduce((sum, m) => sum + m.estimatedCostNgn, 0);
        return { ...dayObj, meals: updatedMeals, totalCalories, totalCostNgn };
      })
    );
    setSwapModalMeal(null);
    toast.success(`Swapped meal for ${dayName}!`);
  };

  // Grocery List computation
  const groceryItems = useMemo(() => {
    return generateGroceryList(customTimetable, period);
  }, [customTimetable, period]);

  const totalGroceryCost = groceryItems.reduce((sum, item) => sum + item.estimatedPriceNgn, 0);
  const totalWeeklyBudget = customTimetable.reduce((sum, d) => sum + d.totalCostNgn, 0);
  const totalBudgetDisplay = period === "monthly" ? totalWeeklyBudget * 4 : totalWeeklyBudget;

  const currentDayData = customTimetable.find((d) => d.day === activeDay) || customTimetable[0];

  const handlePrint = () => {
    window.print();
  };

  const toggleGroceryCheck = (index: number) => {
    setCheckedGrocery((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-8 print:space-y-4">
      {/* 1. Header & Controls Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold border border-teal-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Smart Nigerian Nutrition &amp; Budget Planner
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-heading">
              Personalized Meal Timetable
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Custom meal schedules designed for Nigerian health profiles with weekly &amp; monthly market budget optimization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => setShoppingModalOpen(true)}
              variant="outline"
              className="border-teal-300 text-teal-700 bg-teal-50/50 hover:bg-teal-100 flex items-center gap-2 rounded-xl text-xs font-bold py-2.5 px-4"
            >
              <ShoppingCart className="w-4 h-4 text-teal-600" />
              Market Grocery List ({groceryItems.length} items)
            </Button>
            <Button
              onClick={handlePrint}
              variant="outline"
              className="border-slate-200 hover:bg-slate-50 flex items-center gap-2 rounded-xl text-xs font-bold py-2.5 px-4 text-slate-700"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              Print / Export Timetable
            </Button>
          </div>
        </div>

        {/* 2. Health Condition Selector */}
        <div className="mt-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            Select Health Condition or Dietary Goal:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {Object.values(HEALTH_CONDITION_PROFILES).map((cond) => {
              const isSelected = selectedCondition === cond.key;
              return (
                <button
                  key={cond.key}
                  type="button"
                  onClick={() => handleConditionChange(cond.key)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? "bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/20 scale-[1.02]"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <span className="text-2xl mb-1.5 block">{cond.icon}</span>
                  <div>
                    <p className={`text-xs font-bold leading-tight ${isSelected ? "text-white" : "text-slate-800"}`}>
                      {cond.label.split("(")[0]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Condition Clinical Summary */}
        <div className="mt-6 p-4 md:p-5 bg-teal-50/70 border border-teal-200 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">{conditionProfile.icon}</span>
              <h4 className="text-sm font-bold text-teal-900">{conditionProfile.label} Protocol</h4>
              <span className="text-xs bg-white text-teal-700 px-2.5 py-0.5 rounded-full font-bold border border-teal-200">
                Target: {conditionProfile.calorieTargetRange}
              </span>
            </div>
            <p className="text-xs text-teal-800 leading-relaxed max-w-3xl">
              {conditionProfile.clinicalGuideline}
            </p>
          </div>

          <div className="flex flex-wrap gap-1 text-[11px] font-semibold text-teal-700 shrink-0">
            <span className="bg-white px-2.5 py-1 rounded-lg border border-teal-200">
              ✓ Low-GI Staples
            </span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-teal-200">
              ✓ Local Leafy Veggies
            </span>
          </div>
        </div>

        {/* 4. Budget & Period Configuration */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Budget Timeframe:
            </label>
            <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
              <button
                type="button"
                onClick={() => handlePeriodChange("weekly")}
                className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                  period === "weekly" ? "bg-white text-teal-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Weekly Plan (7 Days)
              </button>
              <button
                type="button"
                onClick={() => handlePeriodChange("monthly")}
                className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                  period === "monthly" ? "bg-white text-teal-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly Plan (4 Weeks)
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Budget Tier (Nigerian Naira):
              </label>
              <span className="text-xs font-bold text-teal-700">
                Est. Total: ₦{totalBudgetDisplay.toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleBudgetChange("economy")}
                className={`py-2 px-3 rounded-xl border text-center text-xs font-bold transition-all ${
                  budgetTier === "economy"
                    ? "bg-teal-600 border-teal-600 text-white shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                Economy (₦15k-22k/wk)
              </button>
              <button
                type="button"
                onClick={() => handleBudgetChange("standard")}
                className={`py-2 px-3 rounded-xl border text-center text-xs font-bold transition-all ${
                  budgetTier === "standard"
                    ? "bg-teal-600 border-teal-600 text-white shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                Standard (₦25k-35k/wk)
              </button>
              <button
                type="button"
                onClick={() => handleBudgetChange("premium")}
                className={`py-2 px-3 rounded-xl border text-center text-xs font-bold transition-all ${
                  budgetTier === "premium"
                    ? "bg-teal-600 border-teal-600 text-white shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                Premium (₦45k+/wk)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Day Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none print:hidden">
        {customTimetable.map((d) => {
          const isActive = activeDay === d.day;
          return (
            <button
              key={d.day}
              type="button"
              onClick={() => setActiveDay(d.day)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
                isActive
                  ? "bg-teal-600 border-teal-600 text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{d.day}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-teal-700 text-teal-100" : "bg-slate-100 text-slate-500"}`}>
                {d.totalCalories} kcal
              </span>
            </button>
          );
        })}
      </div>

      {/* 6. Active Day Timetable View */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <span>{currentDayData.day}&apos;s Meal Schedule</span>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                5 Balanced Meals
              </span>
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              Follow this structured sequence for balanced glucose levels, optimal digestion, and steady energy throughout Nigeria&apos;s day.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Daily Calories</span>
              <span className="text-teal-600 text-sm">{currentDayData.totalCalories} kcal</span>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Est. Day Cost</span>
              <span className="text-slate-900 text-sm">₦{currentDayData.totalCostNgn.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Meal Cards Timeline for the Day */}
        <div className="space-y-4">
          {currentDayData.meals.map((meal, index) => {
            const categoryLabels: Record<string, { title: string; color: string; bg: string }> = {
              breakfast: { title: "Breakfast", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
              snack_morning: { title: "Mid-Morning Refreshment", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
              lunch: { title: "Lunch", color: "text-teal-700", bg: "bg-teal-50 border-teal-200" },
              snack_afternoon: { title: "Afternoon Pick-Me-Up", color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
              dinner: { title: "Dinner", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200" },
            };

            const catInfo = categoryLabels[meal.category] || categoryLabels.breakfast;

            return (
              <div
                key={`${meal.id}-${index}`}
                className="p-5 rounded-2xl border border-slate-200 hover:border-teal-300 transition-all bg-white hover:shadow-xs group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Time & Meal Name */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${catInfo.bg} ${catInfo.color}`}>
                        {catInfo.title} • {meal.time}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        {meal.calories} kcal
                      </span>
                      <span className="text-xs font-semibold text-emerald-600">
                        • ₦{meal.estimatedCostNgn.toLocaleString()}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {meal.name}
                    </h4>

                    <p className="text-xs text-slate-600 italic">
                      💡 {meal.tips}
                    </p>

                    {/* Ingredients chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {meal.ingredients.map((ing, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Macros & Action */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[9px]">Protein</span>
                        <span className="font-bold text-slate-800">{meal.protein}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Carbs</span>
                        <span className="font-bold text-slate-800">{meal.carbs}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Fats</span>
                        <span className="font-bold text-slate-800">{meal.fats}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Fiber</span>
                        <span className="font-bold text-teal-600">{meal.fiber}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => setSwapModalMeal({ day: currentDayData.day, meal })}
                      variant="outline"
                      size="sm"
                      className="border-slate-200 hover:border-teal-500 hover:text-teal-700 text-xs font-semibold rounded-xl"
                      title="Swap this meal with an alternative"
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1" />
                      Swap
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Full 7-Day Print/Overview Grid (Visible for print or expanded review) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-teal-600" />
          Full Weekly Master Timetable Summary
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="p-3 font-bold">Day</th>
                <th className="p-3 font-bold">Breakfast (7:30 AM)</th>
                <th className="p-3 font-bold">Lunch (1:30 PM)</th>
                <th className="p-3 font-bold">Dinner (7:00 PM)</th>
                <th className="p-3 font-bold text-right">Daily Cost (₦)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customTimetable.map((dayData) => {
                const bf = dayData.meals.find((m) => m.category === "breakfast");
                const ln = dayData.meals.find((m) => m.category === "lunch");
                const dn = dayData.meals.find((m) => m.category === "dinner");
                return (
                  <tr key={dayData.day} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900 whitespace-nowrap">{dayData.day}</td>
                    <td className="p-3 text-slate-700 max-w-xs">{bf?.name || "Oat Porridge"}</td>
                    <td className="p-3 text-slate-700 max-w-xs">{ln?.name || "Plantain Pottage"}</td>
                    <td className="p-3 text-slate-700 max-w-xs">{dn?.name || "Fish Pepper Soup"}</td>
                    <td className="p-3 font-bold text-teal-700 text-right whitespace-nowrap">
                      ₦{dayData.totalCostNgn.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 8. Shopping Grocery List Modal */}
      {shoppingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-teal-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    Nigerian Market Shopping List ({period === "monthly" ? "Monthly" : "Weekly"})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Estimated benchmark prices in major Nigerian markets (Mile 12, Bodija, Wuse, Oil Mill)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShoppingModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 flex items-center justify-between text-xs font-bold text-teal-900">
                <span>Total Estimated Grocery Budget:</span>
                <span className="text-base text-teal-700">₦{totalGroceryCost.toLocaleString()}</span>
              </div>

              <div className="space-y-3">
                {groceryItems.map((item, idx) => {
                  const isChecked = Boolean(checkedGrocery[idx]);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleGroceryCheck(idx)}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? "bg-slate-50 border-slate-200 opacity-60 line-through text-slate-400"
                          : "bg-white border-slate-200 hover:border-teal-300 text-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs ${
                            isChecked ? "bg-teal-600 border-teal-600 text-white" : "border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold">{item.name}</p>
                          <span className="text-[10px] text-slate-400">
                            {item.category} • {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-teal-700">
                        ₦{item.estimatedPriceNgn.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <Button onClick={() => setShoppingModalOpen(false)} className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl">
                Done &amp; Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Swap Dish Modal */}
      {swapModalMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Swap {swapModalMeal.meal.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Select a healthy Nigerian alternative for {swapModalMeal.day}
                </p>
              </div>
              <button
                onClick={() => setSwapModalMeal(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-3">
              {NIGERIAN_MEAL_DATABASE.filter(
                (m) => m.category === swapModalMeal.meal.category && m.id !== swapModalMeal.meal.id
              ).map((altMeal) => (
                <div
                  key={altMeal.id}
                  onClick={() => handleSwapMeal(swapModalMeal.day, swapModalMeal.meal.id, altMeal)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/30 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                      {altMeal.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">{altMeal.tips}</p>
                    <span className="text-[10px] text-teal-600 font-semibold">
                      {altMeal.calories} kcal • ₦{altMeal.estimatedCostNgn.toLocaleString()}
                    </span>
                  </div>
                  <Button size="sm" className="bg-teal-600 text-white rounded-xl text-xs">
                    Choose
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
