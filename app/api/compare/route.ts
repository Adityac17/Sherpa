import { NextRequest, NextResponse } from 'next/server';
import { validateRecommendationInput } from '@/lib/validator';
import { callGeminiRanking } from '@/lib/gemini';
import { verifyAndDecorateResources } from '@/lib/verifier';
import { calculateRubricScores } from '@/lib/scorer';
import { PromptComparisonResult } from '@/lib/types';

export const maxDuration = 45; // Allow time for 3 concurrent prompt runs & link verification
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = validateRecommendationInput(body);

    if (!validation.isValid || !validation.sanitizedInput) {
      return NextResponse.json(
        { success: false, error: validation.errorMessage },
        { status: 400 }
      );
    }

    const input = validation.sanitizedInput;
    const versions: Array<'v1' | 'v2' | 'v3'> = ['v1', 'v2', 'v3'];
    const versionNames = {
      v1: 'v1: Basic Unconstrained Prompt',
      v2: 'v2: Structured with Modality Constraints',
      v3: 'v3: Role, Worked Example & Anti-Hallucination Rule',
    };

    const results: PromptComparisonResult[] = await Promise.all(
      versions.map(async (ver) => {
        const start = Date.now();
        const aiResponse = await callGeminiRanking({
          ...input,
          prompt_version: ver,
        });

        const verifiedResources = await verifyAndDecorateResources(aiResponse.resources);
        const rubric = calculateRubricScores(input, verifiedResources);
        const duration = Date.now() - start;

        const verifiedCount = verifiedResources.filter((r) => r.link_status === 'verified_200').length;
        const deadCount = verifiedResources.filter((r) => r.link_status === 'dead_link').length;

        return {
          version: ver,
          prompt_name: versionNames[ver],
          resources: verifiedResources,
          rubric_scores: rubric,
          overall_quality_score: rubric.overall_score,
          generation_time_ms: duration,
          verified_links_count: verifiedCount,
          dead_links_count: deadCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      input,
      comparison: results,
    });
  } catch (err: any) {
    console.error('Comparison error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Comparison failed' },
      { status: 500 }
    );
  }
}

