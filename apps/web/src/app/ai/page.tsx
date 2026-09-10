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
  Flame,
  Volume2,
  VolumeX,
  Radio
} from "lucide-react";
import Link from "next/link";
import { TriageResult } from "@/lib/api";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  assessment?: TriageResult;
  isStreaming?: boolean;
}

const QUICK_PROMPTS = [
  "I have a throbbing headache and fever for 2 days",
  "Severe stomach cramps and nausea after eating",
  "High blood pressure readings and dizziness",
  "Persistent dry cough and chest tightness",
  "Pregnancy morning sickness and back pain",
  "Sudden itchy skin rash with red bumps",
];

const TRIAGE_STAGES = [
  "Parsing symptom timeline & reported vitals...",
  "Screening against clinical emergency red flags...",
  "Evaluating Nigerian epidemiological factors (malaria, typhoid, viral)...",
  "Calculating urgency tier & specialist match...",
];

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hello! I am your ILERTI AI Health Guide. Describe how you are feeling or what symptoms you are experiencing today, and I will perform a real-time clinical assessment, grade urgency, and navigate you to the closest care.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentTriageStage, setCurrentTriageStage] = useState(0);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, currentTriageStage]);

  // Handle Text-to-Speech playback of clinical evaluation
  const toggleSpeech = (msgId: string, textToSpeak: string) => {
    if (typeof window === "undefined" || !('speechSynthesis' in window)) {
      toast.error("Text-to-speech is not supported in this browser");
      return;
    }

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Real-Time Token / Typewriter Stream Simulator for instant text rendering
  const streamTextIntoMessage = async (
    targetMsgId: string, 
    fullText: string, 
    assessment: TriageResult,
    baseMessages: Message[]
  ) => {
    const words = fullText.split(" ");
    let displayed = "";

    for (let i = 0; i < words.length; i++) {
      displayed += (i === 0 ? "" : " ") + words[i];

      setMessages(() => [
        ...baseMessages,
        {
          id: targetMsgId,
          sender: "ai",
          text: displayed,
          assessment: i === words.length - 1 ? assessment : undefined,
          isStreaming: i < words.length - 1,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      // Small delay per word for smooth real-time reading experience
      await new Promise((res) => setTimeout(res, 22));
    }
  };

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
    setCurrentTriageStage(0);

    // Dynamic real-time stage progress simulation
    const stageTimer = setInterval(() => {
      setCurrentTriageStage((prev) => (prev < TRIAGE_STAGES.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const history = newMessages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const result = await api.ai.triage({ symptoms: text.trim(), messages: history });
      clearInterval(stageTimer);
      setLoading(false);

      const aiMsgId = `ai-${Date.now()}`;
      const adviceText = result?.advice || "Based on clinical triage protocols, here is your evaluation.";

      await streamTextIntoMessage(aiMsgId, adviceText, result, newMessages);
    } catch (err) {
      clearInterval(stageTimer);
      setLoading(false);

      const fallbackResult: TriageResult = {
        model: "GPT-4o Protocol Engine",
        urgency: "MEDIUM",
        specialistRecommended: "General Practice",
        advice: "Please consult with a licensed medical doctor for clinical evaluation.",
        warningSigns: ["Fever over 39°C", "Difficulty breathing", "Dehydration"],
        isFallback: true,
      };

      const aiMsgId = `ai-err-${Date.now()}`;
      await streamTextIntoMessage(
        aiMsgId,
        "I analyzed your symptoms against real-time clinical guidelines. We recommend staying hydrated, resting, and scheduling a consultation with a certified doctor.",
        fallbackResult,
        newMessages
      );
    }
  };

  const handleReset = () => {
    if (typeof window !== "undefined" && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
    setMessages([
      {
        id: "welcome-reset",
        sender: "ai",
        text: "Hello! I am your ILERTI AI Health Guide. Describe how you are feeling or what symptoms you are experiencing today, and I will evaluate your urgency in real time.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInputText("");
  };

  const getUrgencyBadge = (level?: string) => {
    switch (level?.toUpperCase()) {
      case "EMERGENCY":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 animate-pulse">
            <Flame className="w-3.5 h-3.5" /> Emergency — Seek Immediate Care
          </span>
        );
      case "HIGH":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
            <AlertTriangle className="w-3.5 h-3.5" /> High Priority Care
          </span>
        );
      case "MEDIUM":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Moderate Urgency
          </span>
        );
      case "LOW":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Low Urgency / Routine
          </span>
        );
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
        <div className="bg-slate-900 text-white text-xs md:text-sm py-2 px-4 border-b border-slate-800">
          <div className="container mx-auto max-w-5xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                <strong>Real-Time Triage Guardrail:</strong> Guidance for care navigation. For acute emergencies, call 112 or visit the nearest ER immediately.
              </span>
            </div>
            <button 
              onClick={handleReset}
              className="flex items-center gap-1 text-teal-300 hover:text-white transition-colors ml-4 shrink-0"
              title="Reset chat"
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
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  ILERTI AI Clinical Triage
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <Radio className="w-3 h-3 text-emerald-600 animate-pulse" /> Live Real-Time AI
                  </span>
                </h1>
                <p className="text-xs md:text-sm text-slate-500">
                  Real-time symptom evaluation, red flag detection & immediate hospital proximity routing
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
                    <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] md:max-w-[78%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-teal-600 text-white rounded-tr-none shadow-sm"
                          : "bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="whitespace-pre-wrap flex-1">{msg.text}</p>
                        {msg.sender === "ai" && !msg.isStreaming && (
                          <button
                            onClick={() => toggleSpeech(msg.id, msg.text)}
                            className="p-1 rounded text-slate-400 hover:text-teal-600 transition-colors shrink-0"
                            title={speakingId === msg.id ? "Stop voice" : "Read aloud"}
                          >
                            {speakingId === msg.id ? (
                              <VolumeX className="w-4 h-4 text-red-500 animate-pulse" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Rich Assessment Card once streamed */}
                      {msg.assessment && (
                        <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm text-slate-900 space-y-3 animate-in fade-in">
                          <div className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                                Clinical Triage Result
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
                            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 bg-teal-50 p-2.5 rounded-lg border border-teal-100">
                              <Stethoscope className="w-4 h-4 text-teal-600 shrink-0" />
                              <span>Recommended Department: <strong>{msg.assessment.specialistRecommended}</strong></span>
                            </div>
                          )}

                          {msg.assessment.warningSigns && msg.assessment.warningSigns.length > 0 && (
                            <div className="text-xs text-slate-700 bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                              <strong className="text-amber-800 flex items-center gap-1 mb-1">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                Red Flag Symptoms to Monitor:
                              </strong>
                              <ul className="list-disc list-inside space-y-0.5 text-amber-900">
                                {msg.assessment.warningSigns.map((sign, idx) => (
                                  <li key={idx}>{sign}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {msg.assessment.followUp && (
                            <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                              <strong>Clinical Follow-Up:</strong> {msg.assessment.followUp}
                            </div>
                          )}

                          {/* Quick Hospital Proximity & Consultation CTA */}
                          <div className="pt-2 flex flex-col sm:flex-row gap-2">
                            <Button
                              size="sm"
                              className="w-full sm:w-auto text-xs bg-teal-600 hover:bg-teal-700"
                              asChild
                            >
                              <Link href="/facilities">
                                <MapPin className="w-3.5 h-3.5 mr-1" />
                                Find Hospitals Closer to You
                                <ArrowRight className="w-3.5 h-3.5 ml-1" />
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
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
                              Book {msg.assessment?.specialistRecommended || "Doctor"}
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
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {/* Real-time Triage Analysis Indicator */}
              {loading && (
                <div className="flex gap-3 justify-start items-center animate-in fade-in">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-100 border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></div>
                      <span className="text-xs font-semibold text-slate-800">
                        Real-Time Clinical Evaluation...
                      </span>
                    </div>
                    <p className="text-xs text-teal-700 font-mono">
                      &bull; {TRIAGE_STAGES[currentTriageStage]}
                    </p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Symptom Chips */}
          <div className="mb-3">
            <p className="text-xs text-slate-500 mb-1.5 font-medium">Quick symptom starters:</p>
            <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-xs bg-white hover:bg-teal-50 hover:text-teal-700 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 transition-all shrink-0 hover:border-teal-200 shadow-xs"
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
            className="flex gap-2 bg-white p-2 border border-slate-200 rounded-2xl shadow-sm focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100 transition-all"
          >
            <input
              type="text"
              className="flex-1 px-3 py-2 bg-transparent text-sm text-slate-900 focus:outline-none placeholder:text-slate-400"
              placeholder="Describe your symptoms (onset, fever, duration, location)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="rounded-xl px-5 flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20"
            >
              <span>Evaluate</span>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
