import { NextRequest, NextResponse } from 'next/server';
import { SyllabusSubject, SyllabusUnit } from '@/lib/types';

export const dynamic = 'force-dynamic';

function fallbackRegexParser(text: string): SyllabusSubject[] {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const subjects: SyllabusSubject[] = [];
  let currentSubject: SyllabusSubject | null = null;
  let currentUnit: SyllabusUnit | null = null;

  for (const line of lines) {
    // Check if line looks like a subject/course header (e.g., CS301: Operating Systems, Course: Database Systems)
    const courseMatch = line.match(/(?:course|subject|code)?\s*([A-Z]{2,4}\s*\d{3,4})[:\s-]+(.*)/i) ||
                        line.match(/^([A-Z][A-Za-z0-9\s,&/]{3,40})$/);

    const unitMatch = line.match(/(?:unit|module|chapter|part)\s*(\d+)[:\s-]*(.*)/i);

    if (unitMatch) {
      if (!currentSubject) {
        currentSubject = {
          id: `sub_${Date.now()}_${subjects.length + 1}`,
          name: 'College Course',
          units: [],
        };
        subjects.push(currentSubject);
      }
      const unitNum = parseInt(unitMatch[1], 10) || (currentSubject.units.length + 1);
      const unitTitle = unitMatch[2].trim() || `Unit ${unitNum}`;
      currentUnit = {
        id: `unit_${Date.now()}_${unitNum}`,
        unit_number: unitNum,
        title: unitTitle,
        topics: [],
      };
      currentSubject.units.push(currentUnit);
    } else if (courseMatch && !unitMatch && !line.startsWith('-') && !line.startsWith('•')) {
      const code = courseMatch[1]?.trim();
      const name = courseMatch[2]?.trim() || line;
      currentSubject = {
        id: `sub_${Date.now()}_${subjects.length + 1}`,
        name: name || 'New Subject',
        code: code?.length <= 10 ? code : undefined,
        units: [],
      };
      subjects.push(currentSubject);
      currentUnit = null;
    } else if (currentUnit) {
      // Append topic line
      const cleanTopic = line.replace(/^[-•*0-9.)\s]+/, '').trim();
      if (cleanTopic.length > 2) {
        // Split by commas if present
        const parts = cleanTopic.split(/[,;]/).map((p) => p.trim()).filter((p) => p.length > 2);
        currentUnit.topics.push(...parts);
      }
    } else if (currentSubject && line.length > 3) {
      // Create a default unit if topics are listed right under subject
      currentUnit = {
        id: `unit_${Date.now()}_1`,
        unit_number: 1,
        title: 'Core Concepts & Topics',
        topics: [line.replace(/^[-•*0-9.)\s]+/, '').trim()],
      };
      currentSubject.units.push(currentUnit);
    }
  }

  // Ensure at least 1 subject if text was provided
  if (subjects.length === 0 && lines.length > 0) {
    subjects.push({
      id: `sub_${Date.now()}_1`,
      name: lines[0].replace(/^[-•*#\s]+/, '').trim() || 'Imported Course',
      units: [
        {
          id: `unit_${Date.now()}_1`,
          unit_number: 1,
          title: 'Foundations & Syllabus Topics',
          topics: lines.slice(1, 10).map((l) => l.replace(/^[-•*0-9.)\s]+/, '').trim()),
        },
      ],
    });
  }

  return subjects;
}

export async function POST(req: NextRequest) {
  try {
    const { raw_text } = await req.json();

    if (!raw_text || typeof raw_text !== 'string' || raw_text.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please provide valid syllabus text to parse.' },
        { status: 400 }
      );
    }

    const freeLlmApiKey = process.env.FREELLMAPI_API_KEY || 'sk-free-key-placeholder';
    const freeLlmBaseUrl = process.env.FREELLMAPI_BASE_URL || 'https://api.freellm.io/v1';
    const geminiApiKey = process.env.GEMINI_API_KEY;

    const extractionPrompt = `You are an academic syllabus parser.
A college student has pasted their university syllabus or course catalog text:
"""
${raw_text.trim().substring(0, 4000)}
"""

Extract all distinct subjects, course codes, and their units/modules.
You MUST return ONLY valid raw JSON matching this schema with NO markdown fences, NO preamble, and NO extra text:
{
  "subjects": [
    {
      "name": "Subject Name",
      "code": "Course Code (e.g. CS301) or null",
      "units": [
        {
          "unit_number": 1,
          "title": "Unit / Module Title",
          "topics": ["Specific subtopic 1", "Specific subtopic 2"]
        }
      ]
    }
  ]
}
`;

    let parsedSubjects: SyllabusSubject[] = [];

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
            messages: [{ role: 'user', content: extractionPrompt }],
            temperature: 0.1,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content || '';
          const cleanJson = content.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          if (Array.isArray(parsed.subjects) && parsed.subjects.length > 0) {
            parsedSubjects = parsed.subjects.map((sub: any, sIdx: number) => ({
              id: `sub_${Date.now()}_${sIdx + 1}`,
              name: sub.name || `Course ${sIdx + 1}`,
              code: sub.code || undefined,
              units: (sub.units || []).map((u: any, uIdx: number) => ({
                id: `unit_${Date.now()}_${sIdx + 1}_${uIdx + 1}`,
                unit_number: u.unit_number || uIdx + 1,
                title: u.title || `Unit ${uIdx + 1}`,
                topics: Array.isArray(u.topics) ? u.topics : [],
              })),
            }));
          }
        }
      } catch (llmErr) {
        console.warn('FreeLLMAPI syllabus parse failed, trying fallback...', llmErr);
      }
    }

    // Attempt Gemini if FreeLLMAPI did not return results and Gemini key exists
    if (parsedSubjects.length === 0 && geminiApiKey && geminiApiKey !== 'your-gemini-api-key') {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: extractionPrompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
          }),
        });

        if (res.ok) {
          const geminiData = await res.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            if (Array.isArray(parsed.subjects) && parsed.subjects.length > 0) {
              parsedSubjects = parsed.subjects.map((sub: any, sIdx: number) => ({
                id: `sub_${Date.now()}_${sIdx + 1}`,
                name: sub.name || `Course ${sIdx + 1}`,
                code: sub.code || undefined,
                units: (sub.units || []).map((u: any, uIdx: number) => ({
                  id: `unit_${Date.now()}_${sIdx + 1}_${uIdx + 1}`,
                  unit_number: u.unit_number || uIdx + 1,
                  title: u.title || `Unit ${uIdx + 1}`,
                  topics: Array.isArray(u.topics) ? u.topics : [],
                })),
              }));
            }
          }
        }
      } catch (gErr) {
        console.warn('Gemini syllabus parse failed, using regex fallback...', gErr);
      }
    }

    // If both AI providers didn't return or are not configured, use heuristic regex parser
    if (parsedSubjects.length === 0) {
      parsedSubjects = fallbackRegexParser(raw_text);
    }

    return NextResponse.json({
      success: true,
      subjects: parsedSubjects,
      total_subjects: parsedSubjects.length,
    });
  } catch (error: any) {
    console.error('Syllabus parse error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to parse syllabus.' },
      { status: 500 }
    );
  }
}

