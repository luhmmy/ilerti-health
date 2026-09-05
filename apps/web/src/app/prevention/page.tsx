import { preventionGuidelines } from '@/data/prevention';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PreventionPage() {
  const categories = Array.from(new Set(preventionGuidelines.map(g => g.category)));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 container max-w-6xl mx-auto py-10 px-4">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#CCFBF1] text-[#0D9488] px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4">
            Public Health & Safety
          </div>
          <h1 className="text-3xl font-bold text-[#1E3A5F] mb-4">Preventive Care Guidelines</h1>
          <p className="text-gray-700 max-w-2xl">Following NPHCDA schedules and standard medical screening milestones. Early detection and immunization are your best defense.</p>
        </div>

        <div className="space-y-10">
          {categories.map(category => (
            <div key={category}>
              <h2 className="text-2xl font-bold text-[#0D9488] border-b-2 border-[#CCFBF1] pb-2 mb-6">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {preventionGuidelines.filter(g => g.category === category).map((guideline, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{guideline.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{guideline.details}</p>
                    
                    <div className="bg-[#FAFAF9] p-3 rounded-xl text-xs space-y-2">
                      <div>
                        <span className="font-semibold text-gray-800">Timing/Frequency:</span> <span className="text-[#0D9488]">{guideline.frequencyOrTiming}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">Target Group:</span> {guideline.targetGroup}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
