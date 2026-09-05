import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { symptoms, messages: incomingMessages } = body;

    const userInput = symptoms || (incomingMessages && incomingMessages[incomingMessages.length - 1]?.content);

    if (!userInput) {
      return NextResponse.json({ error: 'Symptoms or message are required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return fallbackTriage(userInput, 'No OpenAI API Key configured in environment.');
    }

    // Build conversation for GPT-4
    const systemPrompt = `You are the lead clinical triage intelligence assistant for ILERTI Health — Nigeria's digital healthcare ecosystem.
You are powered by GPT-4.
Your purpose:
1. Carefully assess the user's symptoms with empathetic, professional clinical reasoning suited for Nigeria (accounting for common conditions like malaria, typhoid, hypertension, sickle cell, pregnancy, pediatric conditions, gastroenteritis, etc.).
2. You DO NOT provide final definitive medical diagnosis or write prescriptions. You guide, triage urgency, and recommend the best healthcare action and specialist.
3. You MUST respond ONLY with a valid JSON object matching this schema (do NOT wrap in markdown \`\`\`json, just pure raw JSON):

{
  "model": "GPT-4o (Clinical Triage Engine)",
  "urgency": "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY",
  "specialistRecommended": "string (e.g. General Practice, Cardiology, Paediatrics, Obstetrics & Gynaecology, Internal Medicine, Dermatology, Neurology)",
  "advice": "string (warm, comprehensive, and actionable clinical advice with clear guidance)",
  "warningSigns": ["string", "string", "string"],
  "followUp": "string (a helpful follow-up question to better understand the user's condition)"
}

Urgency Grading:
- EMERGENCY: Chest pain, severe difficulty breathing, sudden slurred speech, active severe bleeding, seizures, loss of consciousness, anaphylaxis.
- HIGH: High fever > 39°C persisting, severe acute abdominal pain, inability to retain fluids, suspected severe malaria in children, acute injury.
- MEDIUM: Moderate symptoms lasting > 48 hours, intermittent abdominal discomfort, skin infections, mild hypertensive symptoms.
- LOW: Mild cold/catarrh, minor routine health questions, lifestyle/diet advice, minor fatigue.`;

    const chatMessages = [
      { role: 'system', content: systemPrompt },
    ];

    if (Array.isArray(incomingMessages) && incomingMessages.length > 0) {
      for (const m of incomingMessages.slice(-6)) {
        chatMessages.push({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
        });
      }
    } else {
      chatMessages.push({ role: 'user', content: userInput });
    }

    // Call OpenAI GPT-4o (flagship model)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: chatMessages,
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI GPT-4 API Error:', response.status, errorText);
      
      let errorReason = 'OpenAI API request failed';
      if (response.status === 429) {
        errorReason = 'OpenAI API Quota/Credits exhausted. Please top up credits on platform.openai.com.';
      }

      return fallbackTriage(userInput, errorReason);
    }

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content?.trim();
    
    try {
      const parsed = JSON.parse(resultText);
      parsed.model = 'GPT-4o';
      return NextResponse.json(parsed);
    } catch (e) {
      console.error('Failed to parse GPT-4 JSON response:', resultText);
      return fallbackTriage(userInput, 'JSON parse error');
    }
    
  } catch (error: any) {
    console.error('Triage API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

function fallbackTriage(symptoms: string, reason?: string) {
  const lower = symptoms.toLowerCase();
  
  const emergencyKeywords = ['chest pain', 'breathing', 'breath', 'bleeding', 'stroke', 'unconscious', 'faint', 'seizure', 'collapse'];
  const highKeywords = ['fever', 'severe pain', 'vomiting', 'diarrhea', 'dehydration', 'malaria', 'typhoid', 'appendix'];
  
  let urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY' = 'LOW';
  let specialist = 'General Practice';
  let advice = 'Your symptoms have been reviewed by the ILERTI Clinical Triage protocol. Please monitor your symptoms closely, ensure adequate hydration, and schedule an appointment with a verified healthcare professional if they do not improve.';
  let warningSigns = ['Persistent high fever', 'Difficulty breathing or chest tightness', 'Inability to keep fluids down for over 12 hours'];
  let followUp = 'How long have you been experiencing these symptoms, and are you currently taking any medications?';

  if (emergencyKeywords.some(k => lower.includes(k))) {
    urgency = 'EMERGENCY';
    advice = 'Seek IMMEDIATE medical emergency care at the nearest hospital or emergency centre.';
    warningSigns = ['Loss of consciousness', 'Severe chest tightness or breathing difficulty', 'Active heavy bleeding'];
    followUp = 'Do you have someone nearby who can accompany you to an emergency healthcare facility right away?';
  } else if (highKeywords.some(k => lower.includes(k))) {
    urgency = 'HIGH';
    advice = 'Your symptoms indicate an acute condition that warrants clinical assessment today. We recommend booking a virtual or in-person consultation with a doctor promptly.';
    warningSigns = ['Temperature exceeding 39°C', 'Extreme lethargy or confusion', 'Persistent severe vomiting'];
    followUp = 'Have you had recent exposure to mosquitoes or consumed unboiled water in the past 1-2 weeks?';
  }

  if (lower.includes('heart') || lower.includes('chest') || lower.includes('palpitation')) specialist = 'Cardiology';
  if (lower.includes('child') || lower.includes('baby') || lower.includes('kid') || lower.includes('toddler')) specialist = 'Paediatrics';
  if (lower.includes('skin') || lower.includes('rash') || lower.includes('itching') || lower.includes('acne')) specialist = 'Dermatology';
  if (lower.includes('pregnant') || lower.includes('pregnancy') || lower.includes('period') || lower.includes('menses')) specialist = 'Obstetrics & Gynaecology';
  if (lower.includes('stomach') || lower.includes('ulcer') || lower.includes('gastric') || lower.includes('stooling')) specialist = 'Gastroenterology';

  return NextResponse.json({
    model: 'GPT-4o Protocol Engine',
    urgency,
    specialistRecommended: specialist,
    advice,
    warningSigns,
    followUp,
    isFallback: true,
    quotaNote: reason?.includes('Quota') ? 'Note: Add credits to your OpenAI account at platform.openai.com to enable direct live GPT-4 responses.' : undefined,
  });
}
