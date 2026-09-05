import { nutritionPlans } from '@/data/nutrition';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function NutritionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 container max-w-6xl mx-auto py-10 px-4">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#CCFBF1] text-[#0D9488] px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4">
            Localized Healthy Living
          </div>
          <h1 className="text-3xl font-bold text-[#1E3A5F] mb-4">Nigerian Localized Meal Plans</h1>
          <p className="text-gray-700 max-w-2xl">Healthy eating doesn't mean giving up our rich cultural foods. These balanced meals are tailored to provide optimal nutrition using local Nigerian ingredients.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {nutritionPlans.map((plan) => (
            <div key={plan.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#0D9488] mb-3">{plan.name}</h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {plan.suitability.map((suit, idx) => (
                  <span key={idx} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-200">
                    {suit}
                  </span>
                ))}
              </div>

              <div className="bg-[#FAFAF9] p-4 rounded-xl mb-4 flex justify-between text-sm">
                <div className="text-center">
                  <div className="font-bold text-gray-800">{plan.macros.protein}</div>
                  <div className="text-gray-500 text-xs">Protein</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-800">{plan.macros.carbs}</div>
                  <div className="text-gray-500 text-xs">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-800">{plan.macros.fats}</div>
                  <div className="text-gray-500 text-xs">Fats</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-800">{plan.macros.fiber}</div>
                  <div className="text-gray-500 text-xs">Fiber</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-[#0D9488]">{plan.macros.calories}</div>
                  <div className="text-gray-500 text-xs">kcal</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Preparation Tip:</h3>
                <p className="text-sm text-gray-700">{plan.tips}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
