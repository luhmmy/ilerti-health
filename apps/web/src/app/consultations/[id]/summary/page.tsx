"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, Download, QrCode, Building2, MapPin, 
  Calendar, Clock, Star, MessageSquare, ArrowLeft, CheckCircle2
} from 'lucide-react';

export default function ConsultationSummaryPage() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const tags = ["Punctual", "Thorough explanation", "Empathetic", "Clear prescription", "Great listener"];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Consultation Summary</h1>
            <p className="text-slate-600 mt-1 flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" /> Sept 4, 2026 • <Clock className="w-4 h-4 ml-2" /> 2:30 PM
            </p>
          </div>
          <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium border border-teal-200">
            Completed
          </div>
        </div>

        {/* Doctor Info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-5">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-teal-700">FA</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Dr. Funmilayo Adeleke</h2>
            <p className="text-slate-600 text-sm">General Practitioner</p>
            <p className="text-slate-500 text-xs mt-1 font-mono">MDCN: 482910-FA</p>
          </div>
        </div>

        {/* Advice & Instructions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-600" /> Clinical Advice
          </h3>
          <div className="bg-slate-50 rounded-lg p-4 text-slate-700 text-sm leading-relaxed border border-slate-100">
            Based on our consultation, your headache and fever appear to be symptoms of a mild viral infection. Please take the prescribed medication to manage the symptoms. Ensure you get plenty of rest and stay hydrated. If symptoms persist for more than 3 days or worsen, please schedule a follow-up or visit the nearest clinic.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* E-Prescription Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-teal-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" /> E-Prescription
              </h3>
              <QrCode className="w-6 h-6 opacity-80" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="space-y-4 mb-6">
                <div className="pb-4 border-b border-slate-100">
                  <h4 className="font-bold text-slate-900">Paracetamol (Panadol)</h4>
                  <p className="text-slate-600 text-sm mt-1">500mg • Twice daily • 5 days</p>
                  <p className="text-slate-500 text-xs mt-2 italic">Take after meals.</p>
                </div>
                <div className="pb-2">
                  <h4 className="font-bold text-slate-900">Vitamin C</h4>
                  <p className="text-slate-600 text-sm mt-1">1000mg • Once daily • 10 days</p>
                </div>
              </div>
              <div className="mt-auto pt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                  <CheckCircle2 className="w-3 h-3" /> Validated
                </div>
                <button className="text-teal-600 hover:bg-teal-50 p-2 rounded-lg transition-colors" title="Download PDF">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Facility Referral (Optional) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <Building2 className="w-5 h-5" /> Lab Referral
              </h3>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 text-lg mb-2">Comprehensive Malaria & Typhoid Test</h4>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-800">Recommended Partner Lab:</p>
                  <p className="text-sm text-slate-600 flex items-start gap-2">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                    Synlab Diagnostics, Ikeja GRA, Lagos
                  </p>
                </div>
              </div>
              <div className="mt-auto">
                <button className="w-full py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm">
                  View Directions
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Review Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Rate your experience</h3>
          
          {reviewSubmitted ? (
            <div className="bg-green-50 text-green-800 p-6 rounded-xl text-center border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-bold text-lg mb-1">Thank you for your feedback!</h4>
              <p className="text-green-700 text-sm">Your review helps us improve ILERTI Health.</p>
            </div>
          ) : (
            <form onSubmit={submitReview} className="space-y-6">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star 
                      className={`w-10 h-10 ${
                        star <= (hoverRating || rating) 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'text-slate-200'
                      } transition-colors`} 
                    />
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-teal-50 border-teal-500 text-teal-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  
                  <textarea 
                    className="w-full h-24 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none text-sm"
                    placeholder="Tell us more about your consultation (optional)..."
                  ></textarea>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Back to Dashboard */}
        <div className="text-center pt-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center justify-center gap-2 text-teal-600 hover:text-teal-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Health Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
