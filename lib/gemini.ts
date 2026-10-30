import fs from 'fs';
import path from 'path';
import { RecommendationRequest, ResourceItem } from './types';
import { getCuratedCollegiateResources } from './knowledge_registry';

export interface GeminiResponse {
  resources: ResourceItem[];
  modelUsed: string;
  isFallback: boolean;
  rawResponse?: string;
}

/**
 * Reads the prompt template from the /prompts folder and interpolates inputs.
 */
export function getPromptTemplate(
  version: 'v1' | 'v2' | 'v3' = 'v3',
  inputs: { topic: string; proficiency: string; learning_goal: string }
): string {
  const fileNameMap: Record<string, string> = {
    v1: 'v1_basic.txt',
    v2: 'v2_structured.txt',
    v3: 'v3_structured_examples.txt',
  };

  const filename = fileNameMap[version] || 'v3_structured_examples.txt';
  const filePath = path.join(process.cwd(), 'prompts', filename);

  let template = '';
  try {
    template = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.warn(`Could not read prompt template from ${filePath}, falling back to default inline v3.`);
    template = `Recommend 5 specific, non-generic learning resources for {{topic}} ({{proficiency}}) to achieve {{learning_goal}}. Return JSON only.`;
  }

  return template
    .replace(/\{\{topic\}\}/g, inputs.topic)
    .replace(/\{\{proficiency\}\}/g, inputs.proficiency)
    .replace(/\{\{learning_goal\}\}/g, inputs.learning_goal);
}

/**
 * Helper to normalize raw JSON resource items from any LLM provider.
 */
function normalizeResources(rawResources: any[], request: RecommendationRequest): ResourceItem[] {
  return rawResources.map((item: any, idx: number) => ({
    rank: Number(item.rank) || idx + 1,
    title: String(item.title || `Resource ${idx + 1}`),
    type: (['video', 'course', 'article', 'docs', 'book', 'practice'].includes(item.type)
      ? item.type
      : 'article') as any,
    url: item.url && typeof item.url === 'string' && item.url.trim() !== '' ? item.url.trim() : null,
    why_it_fits: String(item.why_it_fits || 'Highly aligned with student goal.'),
    difficulty: String(item.difficulty || request.proficiency),
    estimated_time: String(item.estimated_time || '2-4 hours'),
    relevance_score: Math.min(10, Math.max(0, Number(item.relevance_score) || 8)),
  }));
}

/**
 * Calls FreeLLMAPI proxy / OpenAI-compatible 7B model endpoint.
 */
async function callFreeLLMAPI(
  prompt: string,
  request: RecommendationRequest
): Promise<GeminiResponse | null> {
  const apiKey = process.env.FREELLMAPI_API_KEY || process.env.FREE_LLM_API_KEY;
  const baseUrl = (process.env.FREELLMAPI_BASE_URL || 'http://localhost:3001/v1').replace(/\/+$/, '');
  const modelName = process.env.FREELLMAPI_MODEL || '7b';

  // If no key is set and baseUrl is the default unconfigured localhost, skip unless explicitly set
  if (!apiKey && !process.env.FREELLMAPI_BASE_URL) {
    return null;
  }

  const endpoint = `${baseUrl}/chat/completions`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout for 7b inference

  try {
    const payload = {
      model: modelName,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert University Academic Advisor and Curriculum Architect. Recommend real, authentic, acclaimed educational resources with specific titles (e.g. Harvard CS50, OSTEP, MIT 6.824, NeetCode 150). NEVER output generic placeholders like "[Topic] Course". Return valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: request.prompt_version === 'v1' ? 0.7 : 0.2,
      response_format: { type: 'json_object' },
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (apiKey && apiKey.trim() !== '') {
      headers['Authorization'] = `Bearer ${apiKey.trim()}`;
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`FreeLLMAPI (${modelName}) returned HTTP ${res.status}: ${errText}`);
      return null;
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const cleaned = content
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned);
    if (!parsed.resources || !Array.isArray(parsed.resources)) return null;

    return {
      resources: normalizeResources(parsed.resources, request),
      modelUsed: `freellmapi-${modelName}`,
      isFallback: false,
      rawResponse: content,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn(`FreeLLMAPI attempt failed: ${err.message}`);
    return null;
  }
}

/**
 * Calls Google Gemini API using structured JSON schema output mode.
 */
async function callGoogleGemini(
  prompt: string,
  request: RecommendationRequest
): Promise<GeminiResponse | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY') {
    return null;
  }

  const models = [
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-2.5-flash',
    'gemini-1.5-flash',
    'gemini-2.0-flash',
  ];

  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: request.prompt_version === 'v1' ? 0.7 : 0.2,
        },
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 429) continue;
        const errText = await res.text();
        console.warn(`Gemini API error with ${model} (${res.status}): ${errText}`);
        continue;
      }

      const jsonResponse = await res.json();
      const candidateText = jsonResponse.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!candidateText) continue;

      const cleaned = candidateText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();

      const parsed = JSON.parse(cleaned);
      if (!parsed.resources || !Array.isArray(parsed.resources)) continue;

      return {
        resources: normalizeResources(parsed.resources, request),
        modelUsed: model,
        isFallback: false,
        rawResponse: candidateText,
      };
    } catch (err: any) {
      console.warn(`Gemini attempt with ${model} failed: ${err.message}`);
    }
  }

  return null;
}

/**
 * Calls NVIDIA NIM API as a resilient high-availability fallback if Gemini expires or hits quota.
 */
async function callNvidiaNimFallback(
  prompt: string,
  request: RecommendationRequest
): Promise<GeminiResponse | null> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey || !apiKey.startsWith('nvapi-')) {
    return null;
  }

  const candidateModels = [
    'deepseek-ai/deepseek-v4.1-flash',
    'google/gemma-4-31b-it',
    'z-ai/glm-5.3-flash',
    'minimaxai/minimax-m3.1-flash',
    'meta/llama-3.2-11b-vision-instruct',
  ];

  for (const model of candidateModels) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content:
                'You are an expert University Academic Advisor and Curriculum Architect. Recommend real, authentic, acclaimed collegiate educational resources with specific titles. Return valid JSON only.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: request.prompt_version === 'v1' ? 0.7 : 0.2,
          max_tokens: 1500,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        continue;
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) continue;

      const cleaned = content
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();

      const parsed = JSON.parse(cleaned);
      if (!parsed.resources || !Array.isArray(parsed.resources)) continue;

      return {
        resources: normalizeResources(parsed.resources, request),
        modelUsed: `nvidia-nim (${model})`,
        isFallback: false,
        rawResponse: content,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
    }
  }

  return null;
}

/**
 * Core LLM Router:
 * 1. Primary: Google Gemini API (gemini-3.5-flash-lite)
 * 2. Fallback: NVIDIA NIM Engine (if Gemini expires or hits quota)
 * 3. Fallback: FreeLLMAPI router
 * 4. Grounded Baseline: Highly curated, non-generic collegiate academic registry
 */
export async function callGeminiRanking(
  request: RecommendationRequest
): Promise<GeminiResponse> {
  const version = request.prompt_version || 'v3';
  const prompt = getPromptTemplate(version, {
    topic: request.topic,
    proficiency: request.proficiency,
    learning_goal: request.learning_goal,
  });

  // 1. Primary: Google Gemini API
  const geminiResponse = await callGoogleGemini(prompt, request);
  if (geminiResponse && geminiResponse.resources.length > 0) {
    return geminiResponse;
  }

  // 2. High-Availability Fallback: NVIDIA NIM API
  const nvidiaResponse = await callNvidiaNimFallback(prompt, request);
  if (nvidiaResponse && nvidiaResponse.resources.length > 0) {
    return nvidiaResponse;
  }

  // 3. Try FreeLLMAPI if configured
  const freeLlmResponse = await callFreeLLMAPI(prompt, request);
  if (freeLlmResponse && freeLlmResponse.resources.length > 0) {
    return freeLlmResponse;
  }

  // 4. Grounded Fallback: Highly-curated, authentic collegiate curriculum
  console.log(`Utilizing curated collegiate academic registry for topic: "${request.topic}" (${request.proficiency})`);
  const curatedResources = getCuratedCollegiateResources(
    request.topic,
    request.proficiency,
    request.learning_goal,
    version
  );

  return {
    resources: curatedResources,
    modelUsed: 'curated-collegiate-academic-engine (high-relevance verified)',
    isFallback: true,
  };
}
