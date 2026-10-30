import { validateRecommendationInput } from '@/lib/validator';
import { callGeminiRanking } from '@/lib/gemini';
import { verifyAndDecorateResources } from '@/lib/verifier';
import { calculateRubricScores } from '@/lib/scorer';
import { saveRun } from '@/lib/storage';
import { dispatchAutomatedAction } from '@/lib/notifier';
import { PipelineStageProgress, RecommendationRun, RecommendationRequest } from '@/lib/types';

export interface PipelineExecutionResult {
  success: boolean;
  run?: RecommendationRun;
  stages: PipelineStageProgress[];
  error?: string;
  latency_ms: number;
}

export async function executePipeline(body: Partial<RecommendationRequest>): Promise<PipelineExecutionResult> {
  const startTime = Date.now();
  const stages: PipelineStageProgress[] = [];

  function recordStage(
    stageNum: number,
    name: string,
    status: 'pending' | 'in_progress' | 'completed' | 'failed',
    message: string
  ) {
    const existingIndex = stages.findIndex((s) => s.stage === stageNum);
    const newStageItem: PipelineStageProgress = {
      stage: stageNum,
      name,
      status,
      message,
      timestamp: new Date().toISOString(),
    };
    if (existingIndex >= 0) {
      stages[existingIndex] = newStageItem;
    } else {
      stages.push(newStageItem);
    }
  }

  try {
    // STAGE 1: Collect & Validate Input
    recordStage(1, 'Input Validation', 'in_progress', 'Validating topic, proficiency, and goal semantics...');
    const validation = validateRecommendationInput(body);

    if (!validation.isValid || !validation.sanitizedInput) {
      recordStage(1, 'Input Validation', 'failed', validation.errorMessage || 'Invalid input.');
      return {
        success: false,
        error: validation.errorMessage || 'Invalid input.',
        stages,
        latency_ms: Date.now() - startTime,
      };
    }

    const input = validation.sanitizedInput;
    recordStage(1, 'Input Validation', 'completed', `Input validated: Topic "${input.topic}", Level: ${input.proficiency}`);

    // STAGE 2: AI Ranking with Gemini / FreeLLMAPI
    recordStage(2, 'Gemini AI Ranking', 'in_progress', `Generating ranked resources using prompt ${input.prompt_version}...`);
    const aiResult = await callGeminiRanking(input);
    recordStage(
      2,
      'Gemini AI Ranking',
      'completed',
      `Generated ${aiResult.resources.length} candidate resources (${aiResult.modelUsed})`
    );

    // STAGE 3: Validation, Link Verification & Quality Scoring
    recordStage(3, 'Link Verification & Quality Scoring', 'in_progress', 'Performing asynchronous HTTP HEAD integrity checks...');
    const verifiedResources = await verifyAndDecorateResources(aiResult.resources);
    const rubricScores = calculateRubricScores(input, verifiedResources);
    const verifiedCount = verifiedResources.filter((r) => r.link_status === 'verified_200').length;
    recordStage(
      3,
      'Link Verification & Quality Scoring',
      'completed',
      `Checked ${verifiedResources.length} URLs: ${verifiedCount} verified live (200 OK). Quality Score: ${rubricScores.overall_score}/100.`
    );

    // STAGE 4: Store in Database (Firebase Firestore + Local fallback)
    recordStage(4, 'Database Storage', 'in_progress', 'Persisting run metadata, link checks, and rubric scores...');

    const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newRun: RecommendationRun = {
      id: runId,
      created_at: new Date().toISOString(),
      topic: input.topic,
      proficiency: input.proficiency,
      learning_goal: input.learning_goal,
      prompt_version: input.prompt_version || 'v3',
      student_email: input.student_email,
      resources: verifiedResources,
      rubric_scores: rubricScores,
      overall_quality_score: rubricScores.overall_score,
      stages_completed: stages,
      storage_target: 'firebase',
      ai_model_used: aiResult.modelUsed,
    };

    const storageResult = await saveRun(newRun);
    newRun.storage_target = storageResult.target;
    recordStage(4, 'Database Storage', 'completed', storageResult.message);

    // STAGE 5: Automated Action (Email Notification / Proof Log)
    recordStage(5, 'Automated Action', 'in_progress', 'Dispatching automated email notification & generating execution proof...');
    let executionProof;
    if (input.student_email) {
      executionProof = await dispatchAutomatedAction({
        student_email: input.student_email,
        topic: input.topic,
        proficiency: input.proficiency,
        learning_goal: input.learning_goal,
        prompt_version: input.prompt_version || 'v3',
        resources: verifiedResources,
        rubric_scores: rubricScores,
        overall_score: rubricScores.overall_score,
      });
      newRun.execution_proof = executionProof;
      recordStage(5, 'Automated Action', 'completed', executionProof.details);
    } else {
      recordStage(5, 'Automated Action', 'completed', 'Email omitted by user. Pipeline logged ready for automated trigger.');
    }

    return {
      success: true,
      run: newRun,
      stages,
      latency_ms: Date.now() - startTime,
    };
  } catch (err: any) {
    console.error('Pipeline execution error:', err);
    recordStage(5, 'Pipeline Failure', 'failed', err.message || 'An unexpected pipeline error occurred.');
    return {
      success: false,
      error: err.message || 'Server error',
      stages,
      latency_ms: Date.now() - startTime,
    };
  }
}

