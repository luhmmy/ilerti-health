import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { symptoms } = await req.json();

    if (!symptoms || typeof symptoms !== 'string') {
      return NextResponse.json({ error: 'Symptoms are required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Fallback rule-based triage if no API key is provided
      return fallbackTriage(symptoms);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a strict clinical triage assistant for ILERTI Health (Nigeria).
Your purpose is to assess symptom urgency, NOT to diagnose or prescribe.
DO NOT provide medical diagnoses. DO NOT prescribe medication.
You MUST output ONLY a JSON object with the following structure, and nothing else (no markdown wrapping, just raw JSON):
{
  "urgency": "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY",
  "specialistRecommended": "string (e.g. General Practice, Cardiology)",
  "advice": "string (clear, actionable next steps)",
  "warningSigns": ["string"] (list of red flags to watch out for)
}

Rules for urgency:
- EMERGENCY: chest pain, severe bleeding, difficulty breathing, stroke symptoms.
- HIGH: high fever, severe pain, severe dehydration.
- MEDIUM: moderate pain, persistent mild symptoms.
- LOW: mild, self-limiting symptoms.
`
          },
          {
            role: 'user',
            content: symptoms,
          },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API Error:', await response.text());
      return fallbackTriage(symptoms);
    }

    const data = await response.json();
    const resultText = data.choices[0].message.content.trim();
    
    try {
      const parsed = JSON.parse(resultText);
      return NextResponse.json(parsed);
    } catch (e) {
      console.error('Failed to parse OpenAI response:', resultText);
      return fallbackTriage(symptoms);
    }
    
  } catch (error) {
    console.error('Triage API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function fallbackTriage(symptoms: string) {
  const lowerSymptoms = symptoms.toLowerCase();
  
  const emergencyKeywords = ['chest pain', 'breathing', 'breath', 'bleeding', 'stroke', 'unconscious', 'faint'];
  const highKeywords = ['fever', 'severe pain', 'vomiting', 'diarrhea', 'dehydration'];
  
  let urgency = 'LOW';
  let specialist = 'General Practice';
  let advice = 'Please monitor your symptoms. If they persist, consult a doctor.';
  let warningSigns = ['Worsening of symptoms', 'High fever', 'Inability to keep fluids down'];

  if (emergencyKeywords.some(k => lowerSymptoms.includes(k))) {
    urgency = 'EMERGENCY';
    advice = 'Seek IMMEDIATE medical attention at the nearest emergency room.';
    warningSigns = ['Loss of consciousness', 'Severe difficulty breathing', 'Continuous severe pain'];
  } else if (highKeywords.some(k => lowerSymptoms.includes(k))) {
    urgency = 'HIGH';
    advice = 'Please consult a doctor as soon as possible today.';
    warningSigns = ['Symptoms become severe rapidly', 'Confusion or extreme lethargy'];
  }

  if (lowerSymptoms.includes('heart') || lowerSymptoms.includes('chest')) specialist = 'Cardiology';
  if (lowerSymptoms.includes('child') || lowerSymptoms.includes('baby')) specialist = 'Paediatrics';
  if (lowerSymptoms.includes('skin') || lowerSymptoms.includes('rash')) specialist = 'Dermatology';

  return NextResponse.json({
    urgency,
    specialistRecommended: specialist,
    advice,
    warningSigns,
    isFallback: true
  });
}
