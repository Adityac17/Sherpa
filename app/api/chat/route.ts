import { NextRequest, NextResponse } from 'next/server';
import { executePipeline } from '@/lib/pipeline';
import { ProficiencyLevel } from '@/lib/types';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const {
      message,
      history = [],
      proficiency = 'Intermediate',
      learning_goal = 'Pass university exam',
      prompt_version = 'v3',
      student_email,
    } = await req.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please enter a message or question.' },
        { status: 400 }
      );
    }

    const cleanMsg = message.trim();

    // Check if the message is a nonsense edge case (e.g., asdfghjkl1234!@#$%)
    const alphaCount = (cleanMsg.match(/[a-zA-Z]/g) || []).length;
    const specialCount = (cleanMsg.match(/[^a-zA-Z0-9\s]/g) || []).length;
    if (specialCount > alphaCount && cleanMsg.length > 8) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid topic: the input appears to be random characters or nonsense. Please enter a valid academic topic.',
        },
        { status: 400 }
      );
    }

    // Determine if this is a roadmap/study request or a follow-up question
    const isStudyRequest =
      cleanMsg.toLowerCase().startsWith('study unit:') ||
      cleanMsg.toLowerCase().startsWith('study:') ||
      /roadmap|learn|study|exam|course|tutorial|resources|guide|syllabus|prepare|unit|curriculum/i.test(cleanMsg) ||
      cleanMsg.length < 50; // Short queries like "Operating Systems" or "React & Node" are direct topic searches

    if (isStudyRequest) {
      // Clean up topic title if prefixed by "Study Unit:"
      let topic = cleanMsg.replace(/^study unit:\s*/i, '').replace(/^study:\s*/i, '').trim();

      const pipelineResult = await executePipeline({
        topic,
        proficiency: proficiency as ProficiencyLevel,
        learning_goal,
        prompt_version: prompt_version as any,
        student_email,
      });

      if (!pipelineResult.success || !pipelineResult.run) {
        return NextResponse.json(
          {
            success: false,
            error: pipelineResult.error || 'Failed to generate study roadmap.',
            stages: pipelineResult.stages,
          },
          { status: 400 }
        );
      }

      const verifiedCount = pipelineResult.run.resources.filter(
        (r) => r.link_status === 'verified_200'
      ).length;

      const reply = `I've constructed a verified collegiate study roadmap for **${pipelineResult.run.topic}** tailored to **${pipelineResult.run.proficiency}** proficiency and aimed at: *${pipelineResult.run.learning_goal}*.\n\nAll ${pipelineResult.run.resources.length} resources have undergone HTTP HEAD link verification (${verifiedCount} verified live with HTTP 200). Overall curriculum quality score: **${pipelineResult.run.overall_quality_score}/100**.`;

      return NextResponse.json({
        success: true,
        reply,
        recommendationRun: pipelineResult.run,
        stages: pipelineResult.stages,
      });
    }

    // Otherwise, treat as conversational follow-up / academic guidance
    const freeLlmApiKey = process.env.FREELLMAPI_API_KEY || 'sk-free-key-placeholder';
    const freeLlmBaseUrl = process.env.FREELLMAPI_BASE_URL || 'https://api.freellm.io/v1';
    const geminiApiKey = process.env.GEMINI_API_KEY;

    const systemPrompt = `You are Sherpa, an expert collegiate academic advisor and computer science professor.
Answer the student's question concisely, rigorously, and clearly with university-caliber academic depth.
Keep answers under 3-4 paragraphs, formatted in clean Markdown.`;

    let assistantReply = '';

    // Attempt FreeLLMAPI first
    if (freeLlmApiKey && freeLlmApiKey !== 'sk-free-key-placeholder') {
      try {
        const response = await fetch(`${freeLlmBaseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${freeLlmApiKey}`,
          },
          body: JSON.stringify({
            model: process.env.FREELLMAPI_MODEL || '7b',
            messages: [
              { role: 'system', content: systemPrompt },
              ...history.slice(-4),
              { role: 'user', content: cleanMsg },
            ],
            temperature: 0.3,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          assistantReply = data.choices?.[0]?.message?.content || '';
        }
      } catch (err) {
        console.warn('FreeLLMAPI conversational follow-up failed:', err);
      }
    }

    // Attempt Gemini if FreeLLMAPI did not respond
    if (!assistantReply && geminiApiKey && geminiApiKey !== 'your-gemini-api-key') {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemPrompt}\n\nStudent question:\n${cleanMsg}`,
                  },
                ],
              },
            ],
            generationConfig: { temperature: 0.3 },
          }),
        });

        if (res.ok) {
          const geminiData = await res.json();
          assistantReply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      } catch (gErr) {
        console.warn('Gemini conversational follow-up failed:', gErr);
      }
    }

    // Resilient educational fallback if offline
    if (!assistantReply) {
      assistantReply = `Here is how to approach **${cleanMsg}**:\n\n1. **Core Concept:** Start by breaking the topic down into its fundamental theoretical invariants before jumping into code.\n2. **Collegiate Reference:** Consult primary sources (such as OSTEP for systems, CLRS for algorithms, or official documentation) to verify exact semantics.\n3. **Practice Implementation:** Build a minimal reproduction or solve 2-3 focused problem sets to validate your mental model.`;
    }

    return NextResponse.json({
      success: true,
      reply: assistantReply,
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Chat service error' },
      { status: 500 }
    );
  }
}

