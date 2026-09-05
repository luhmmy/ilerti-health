import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { ScrollReveal } from "@/components/marketing/ScrollReveal";
import { 
  Stethoscope, Activity, FileText, Pill, 
  Baby, HeartPulse, Brain, Apple, ArrowRight,
  ShieldCheck, MessageSquare, Video, Shield
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const HEALTH_JOURNEY_OPTIONS = [
  { icon: Activity, title: "AI Symptom Checker", desc: "Interactive AI navigation & triage", color: "text-primary-500", bg: "bg-primary-50", href: "/signup" },
  { icon: Stethoscope, title: "Find a Doctor", desc: "Book verified specialists", color: "text-blue-500", bg: "bg-blue-50", href: "/signup" },
  { icon: FileText, title: "Lab & Diagnostic Tests", desc: "Find accredited diagnostic labs", color: "text-purple-500", bg: "bg-purple-50", href: "/signup" },
  { icon: Pill, title: "Medication Reminders", desc: "Track doses & prescriptions", color: "text-accent-500", bg: "bg-accent-50", href: "/signup" },
  { icon: Baby, title: "Maternal Care", desc: "Pregnancy & childcare plans", color: "text-pink-500", bg: "bg-pink-50", href: "/signup" },
  { icon: HeartPulse, title: "Chronic Care", desc: "Diabetes & hypertension support", color: "text-red-500", bg: "bg-red-50", href: "/signup" },
  { icon: Brain, title: "Mental Health", desc: "Therapy & clinical support", color: "text-indigo-500", bg: "bg-indigo-50", href: "/signup" },
  { icon: Apple, title: "Nigerian Nutrition", desc: "Localized healthy meal plans", color: "text-orange-500", bg: "bg-orange-50", href: "/signup" },
];

export default function Home() {
  return (
    <main className="flex-1">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-white -z-10" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-primary-100/40 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[400px] h-[400px] bg-accent-100/30 rounded-full blur-3xl -z-10" />
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <div className="flex justify-center mb-8">
                <BrandLogo size="xl" withLink={false} />
              </div>
              <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-navy-900 leading-tight mb-6 tracking-tight">
                Your Health Journey <br className="hidden md:block" />
                <span className="text-primary-600">Starts Here</span>
              </h1>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <p className="text-lg md:text-xl text-navy-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                ILERTI connects you to trusted health information, verified doctors, healthcare facilities, and personalized wellness — all in one place.
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="xl" asChild className="w-full sm:w-auto shadow-lg shadow-primary-500/20 text-md">
                  <Link href="/signup">✨ Create Free Account</Link>
                </Button>
                <Button size="xl" variant="outline" asChild className="w-full sm:w-auto bg-white text-md">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Options Grid Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-4">
                What can we help you with today?
              </h2>
              <p className="text-navy-600">Select an option to begin your personalized health journey.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {HEALTH_JOURNEY_OPTIONS.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.05}>
                <Link href={item.href}>
                  <Card className="h-full hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 group cursor-pointer border-navy-100">
                    <CardContent className="p-6 flex flex-col items-start">
                      <div className={`p-3 rounded-xl ${item.bg} ${item.color} mb-4 group-hover:scale-110 transition-transform`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-heading font-semibold text-lg text-navy-900 mb-1 group-hover:text-primary-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-navy-500 text-sm mb-4 flex-1">
                        {item.desc}
                      </p>
                      <div className="mt-auto flex items-center text-sm font-medium text-primary-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        Get started <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-navy-50">
        <div className="container mx-auto px-4 md:px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900 mb-4">
                How It Works
              </h2>
              <p className="text-navy-600 max-w-2xl mx-auto">
                A seamless experience designed to get you the care you need, when you need it.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-navy-200 z-0 border-t-2 border-dashed border-navy-200"></div>
            
            {[
              { icon: MessageSquare, title: "Tell us how you feel", desc: "Use our AI navigation or chat with a care guide." },
              { icon: ShieldCheck, title: "Get matched", desc: "We connect you with the right verified professional." },
              { icon: Video, title: "Consult easily", desc: "Connect via secure chat, audio, or video call." },
              { icon: Activity, title: "Continue your journey", desc: "Receive follow-ups and ongoing health support." }
            ].map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.1} className="relative z-10 text-center">
                <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-sm border border-navy-100 flex items-center justify-center mb-6">
                  <step.icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold absolute top-16 right-1/2 translate-x-10 -translate-y-2 border-2 border-white">
                  {i + 1}
                </div>
                <h3 className="font-heading font-semibold text-lg text-navy-900 mb-2">{step.title}</h3>
                <p className="text-navy-600 text-sm">{step.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">Trusted by thousands across Nigeria</h2>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { label: "Verified Doctors", value: "2,000+" },
              { label: "Healthcare Facilities", value: "500+" },
              { label: "Health Journeys", value: "50k+" },
              { label: "States Covered", value: "36" }
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="text-4xl md:text-5xl font-bold font-heading mb-2">{stat.value}</div>
                <div className="text-primary-100 text-sm md:text-base font-medium">{stat.label}</div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              { 
                icon: Brain, 
                title: "AI Health Navigation", 
                desc: "Describe your symptoms to our intelligent assistant and get directed to the right level of care immediately."
              },
              { 
                icon: Shield, 
                title: "Verified Network", 
                desc: "Every doctor and facility on ILERTI is thoroughly vetted to ensure you receive the highest quality of care."
              },
              { 
                icon: HeartPulse, 
                title: "Complete Journey", 
                desc: "From symptoms to diagnosis, prescriptions, and follow-ups. We manage your entire healthcare experience."
              }
            ].map((feature, i) => (
              <ScrollReveal key={i} delay={i * 0.1} className="flex flex-col items-start">
                <div className="p-4 bg-primary-50 rounded-2xl mb-6 text-primary-600">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy-900 mb-3">{feature.title}</h3>
                <p className="text-navy-600 leading-relaxed">{feature.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-400 via-navy-900 to-navy-900"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <ScrollReveal>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to take control of your health?
            </h2>
            <p className="text-navy-200 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Join thousands of Nigerians on their health journey. Get access to verified doctors, seamless care, and personalized wellness.
            </p>
            <Button size="xl" asChild className="bg-primary-600 hover:bg-primary-500 text-white border-none text-lg px-8 shadow-xl cursor-pointer">
              <Link href="/signup">Create Your Free Account</Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
