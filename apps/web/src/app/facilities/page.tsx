import { facilities } from '@/data/facilities';

export default function FacilitiesPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-[#1E3A5F] mb-8">Healthcare Facilities</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {facilities.map((facility) => (
          <div key={facility.id} className="border rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 h-48 md:h-auto bg-gray-200">
              <img src={facility.imageUrl} alt={facility.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-[#0D9488]">{facility.name}</h2>
                {facility.has247ER && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-semibold border border-red-200">24/7 ER</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">{facility.address}, {facility.city}, {facility.state}</p>
              
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">HMO Partners</h3>
                <div className="flex flex-wrap gap-1">
                  {facility.hmoAffiliations.map(hmo => (
                    <span key={hmo} className="bg-[#CCFBF1] text-[#0D9488] text-xs px-2 py-1 rounded">{hmo}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Diagnostics</h3>
                <p className="text-xs text-gray-600">{facility.diagnosticServices.join(', ')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
