import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private readonly logger = new Logger(AiService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async triage(symptoms: string) {
    try {
      const prompt = `You are a medical triage AI assistant for ILERTI Health in Nigeria. 
      Analyze the following symptoms and provide a triage assessment.
      
      Symptoms: "${symptoms}"
      
      Respond with a JSON object containing:
      - urgencyLevel: "LOW", "MEDIUM", "HIGH", or "EMERGENCY"
      - nextStep: "SELF_CARE", "BOOK_DOCTOR", or "URGENT_CARE"
      - chiefComplaint: A brief summary of the main issue
      - followUpQuestions: Array of 1-3 questions to ask for more context
      - warning: Always include a standard medical disclaimer
      
      Ensure safe guardrails: If symptoms indicate chest pain, severe bleeding, difficulty breathing, or stroke symptoms, classify as EMERGENCY and recommend URGENT_CARE.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: prompt }],
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result;
    } catch (error) {
      this.logger.error('Error in AI triage', error);
      // Fallback response for safety
      return {
        urgencyLevel: 'HIGH',
        nextStep: 'BOOK_DOCTOR',
        chiefComplaint: 'System was unable to fully process symptoms. Please consult a doctor.',
        followUpQuestions: [],
        warning: 'This is an automated fallback response. If you are experiencing an emergency, please visit a hospital immediately.',
      };
    }
  }
}
