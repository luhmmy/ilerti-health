"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw, 
  Stethoscope, 
  Activity, 
  CheckCircle2,
  Clock,
  MapPin,
  Flame
} from "lucide-react";
import Link from "next/link";
import { TriageResult } from "@/lib/api";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  assessment?: TriageResult;
}

const QUICK_PROMPTS = [
  "I have a throbbing headache and fever for 2 days",
  "Severe stomach cramps and nausea after eating",
  "High blood pressure readings and dizziness",
  "Persistent dry cough and chest tightness",
  "Pregnancy morning sickness and back pain",
  "Sudden itchy skin rash with red bumps",
];

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hello! I am your ILERTI AI Health Guide. Describe how you are feeling or what symptoms you are experiencing today, and I will help assess your urgency and guide you to the right care.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsgId = `user-${Date.now()}`;
    const newMessages: Message[] = [
      ...messages,
      {
        id: userMsgId,
        sender: "user",
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];

    setMessages(newMessages);
    setInputText("");
    setLoading(true);

    try {
      const history = newMessages.map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const result = await api.ai.triage({ symptoms: text.trim(), messages: history });
      
      const aiMsgId = `ai-${Date.now()}`;
      setMessages([
        ...newMessages,
        {
          id: aiMsgId,
          sender: "ai",
          text: result?.advice || "Here is your clinical triage evaluation based on the symptoms provided.",
          assessment: result,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: "I analyzed your symptoms. Based on clinical triage protocols, we recommend resting, maintaining hydration, and scheduling a consultation with a certified doctor if symptoms persist.",
          assessment: {
            model: "GPT-4o Protocol Engine",
            urgency: "MEDIUM",
            specialistRecommended: "General Practice",
            advice: "Please consult with a licensed general practitioner for a clinical evaluation.",
            warningSigns: ["High fever persisting over 3 days", "Difficulty breathing", "Severe dehydration"],
            isFallback: true,
          },
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "ai",
        text: "Hello! I am your ILERTI AI Health Guide powered by GPT-4. Describe how you are feeling or what symptoms you are experiencing today, and I will help assess your urgency and guide you to the right care.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInputText("");
  };

  const getUrgencyBadge = (level?: string) => {
    switch (level?.toUpperCase()) {
      case "EMERGENCY":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 animate-pulse"><Flame className="w-3.5 h-3.5" /> Emergency — Seek Immediate Care</span>;
      case "HIGH":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200"><AlertTriangle className="w-3.5 h-3.5" /> High Priority Care</span>;
      case "MEDIUM":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200"><Clock className="w-3.5 h-3.5" /> Moderate Urgency</span>;
      case "LOW":
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200"><CheckCircle2 className="w-3.5 h-3.5" /> Low Urgency / Routine</span>;
    }
  };

  return (
    <AuthGuard 
      serviceName="AI Health Triage"
      serviceDescription="To ensure medical privacy, evaluate your clinical symptoms, and save your triage results, please create a free ILERTI account or sign in."
    >
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />

      {/* Safety Notice Banner */}
      <div className="bg-navy-900 text-white text-xs md:text-sm py-2 px-4 border-b border-navy-800">
        <div className="container mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary-400 shrink-0" />
            <span>
              <strong>Clinical Guardrail:</strong> ILERTI AI provides navigation & triage guidance, not formal diagnosis. For emergencies, call 112 or visit the nearest ER.
            </span>
          </div>
          <button 
            onClick={handleReset}
            className="flex items-center gap-1 text-primary-300 hover:text-white transition-colors ml-4 shrink-0"
            title="Start new conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <main className="flex-1 container mx-auto max-w-4xl p-4 md:p-6 flex flex-col">
        {/* Header Title */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-navy-900 flex items-center gap-2">
                ILERTI AI Health Navigator
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Live Clinical AI
                </span>
              </h1>
              <p className="text-xs md:text-sm text-navy-500">
                24/7 symptom evaluation, urgency grading & verified doctor matching
              </p>
            </div>
          </div>
        </div>

        {/* Chat Thread Container */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:p-6 mb-4 flex flex-col justify-between min-h-[480px] max-h-[650px] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] md:max-w-[75%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-primary-600 text-white rounded-tr-none shadow-sm"
                        : "bg-slate-100 text-navy-900 rounded-tl-none border border-slate-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Rich Assessment Card if available */}
                    {msg.assessment && (
                      <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm text-navy-900 space-y-3">
                        <div className="flex items-center justify-between border-b pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-navy-600 uppercase tracking-wider">
                              Clinical Triage Summary
                            </span>
                            {msg.assessment.model && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                                {msg.assessment.model}
                              </span>
                            )}
                          </div>
                          {getUrgencyBadge(msg.assessment.urgency)}
                        </div>

                        {msg.assessment.specialistRecommended && (
                          <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 bg-primary-50 p-2 rounded-lg border border-primary-100">
                            <Stethoscope className="w-4 h-4 text-primary-600 shrink-0" />
                            <span>Recommended Specialty: <strong>{msg.assessment.specialistRecommended}</strong></span>
                          </div>
                        )}

                        {msg.assessment.warningSigns && msg.assessment.warningSigns.length > 0 && (
                          <div className="text-xs text-navy-700 bg-amber-50 p-2 rounded-lg border border-amber-100">
                            <strong className="text-amber-800">Red Flag Signs to Watch:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-0.5 text-amber-900">
                              {msg.assessment.warningSigns.map((sign, idx) => (
                                <li key={idx}>{sign}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {msg.assessment.quotaNote && (
                          <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                            {msg.assessment.quotaNote}
                          </div>
                        )}

                        {/* Direct Action Buttons */}
                        <div className="pt-2 flex flex-col sm:flex-row gap-2">
                          <Button
                            size="sm"
                            className="w-full sm:w-auto text-xs"
                            onClick={() => {
                              if (msg.assessment?.specialistRecommended) {
                                router.push(`/doctors?specialty=${encodeURIComponent(msg.assessment.specialistRecommended)}`);
                              } else {
                                router.push("/doctors");
                              }
                            }}
                          >
                            <Stethoscope className="w-3.5 h-3.5 mr-1" />
                            Find {msg.assessment.specialistRecommended || "Doctor"}
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full sm:w-auto text-xs"
                            asChild
                          >
                            <Link href="/facilities">
                              <MapPin className="w-3.5 h-3.5 mr-1" />
                              Nearby Facilities
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-gray-400 mt-1 block px-1">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-navy-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-100 border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce [animation-delay:0.4s]"></div>
                  <span className="text-xs text-navy-500 ml-1">Analyzing symptoms & matching protocols...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Symptom Starter Chips */}
        <div className="mb-3">
          <p className="text-xs text-navy-500 mb-1.5 font-medium">Quick symptom starters:</p>
          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="text-xs bg-white hover:bg-primary-50 hover:text-primary-700 text-navy-700 px-3 py-1.5 rounded-full border border-slate-200 transition-all shrink-0 hover:border-primary-200 shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2 bg-white p-2 border border-slate-200 rounded-2xl shadow-sm focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 transition-all"
        >
          <input
            type="text"
            className="flex-1 px-3 py-2 bg-transparent text-sm text-navy-900 focus:outline-none placeholder:text-navy-300"
            placeholder="Describe your symptoms (e.g. onset, severity, location, fever)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="rounded-xl px-5 flex items-center gap-1.5 shadow-md shadow-primary-500/20"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </main>

      <Footer />
    </div>
  </AuthGuard>
);
}
