import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { validateRecommendationInput } from '@/lib/validator';
import { callGeminiRanking } from '@/lib/gemini';
import { verifyAndDecorateResources } from '@/lib/verifier';
import { calculateRubricScores } from '@/lib/scorer';
import { saveRun } from '@/lib/storage';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST() {
  const testsDir = path.join(process.cwd(), 'tests');
  const testFiles = [
    'case_1_beginner_topic.json',
    'case_2_advanced_topic.json',
    'case_3_vague_goal.json',
    'case_4_two_goals.json',
    'case_5_edge_case_nonsense.json',
  ];

  const results = [];

  for (const file of testFiles) {
    const filePath = path.join(testsDir, file);
    const testData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const start = Date.now();
    let passed = false;
    let notes = '';
    let rubric = null;

    const val = validateRecommendationInput(testData.input);

    if (!testData.assertions.should_pass_validation) {
      if (!val.isValid) {
        passed = true;
        notes = `Correctly rejected invalid input: "${val.errorMessage}"`;
      } else {
        passed = false;
        notes = 'Validation failed: Expected rejection, but validator accepted the input.';
      }
    } else {
      if (val.isValid && val.sanitizedInput) {
        try {
          const aiRes = await callGeminiRanking(val.sanitizedInput);
          const verified = await verifyAndDecorateResources(aiRes.resources);
          rubric = calculateRubricScores(val.sanitizedInput, verified);

          const minScore = testData.assertions.minimum_rubric_quality_score || 70;
          const minCount = testData.assertions.minimum_resource_count || 3;

          passed = rubric.overall_score >= minScore && verified.length >= minCount;
          notes = `Generated ${verified.length} verified resources. Quality Score: ${rubric.overall_score}/100.`;
        } catch (err: any) {
          passed = false;
          notes = `Execution error: ${err.message}`;
        }
      } else {
        passed = false;
        notes = `Valid input was unexpectedly rejected: ${val.errorMessage}`;
      }
    }

    const duration = Date.now() - start;
    results.push({
      id: testData.id,
      name: testData.name,
      passed,
      notes,
      duration_ms: duration,
      input: testData.input,
      rubric,
    });
  }

  // Update tests/report.md
  const reportPath = path.join(testsDir, 'report.md');
  const timestamp = new Date().toISOString();
  const passedCount = results.filter((r) => r.passed).length;

  const reportMarkdown = `# Personalized Learning Resource Recommender - Test Suite Report

> **Execution Timestamp:** \`${timestamp}\`  
> **Overall Result:** **${passedCount}/${results.length} Passed (${Math.round((passedCount / results.length) * 100)}%)**  
> **Environment:** Next.js App Router, Gemini API, Asynchronous Link Verifier, Rubric Scorer

---

## 1. Test Summary

| Test ID | Case Description | Status | Latency | Key Observations |
| :--- | :--- | :---: | :---: | :--- |
${results.map((r) => `| \`${r.id}\` | **${r.name}** | ${r.passed ? '✅ PASS' : '❌ FAIL'} | ${r.duration_ms}ms | ${r.notes.replace(/\|/g, '-')} |`).join('\n')}

---

## 2. Detailed Case Analysis

${results.map((r, i) => `
### Test Case ${i + 1}: ${r.name} (\`${r.id}\`)
- **Input Parameters:** Topic: \`${r.input.topic || 'N/A'}\` | Level: \`${r.input.proficiency || 'N/A'}\` | Goal: \`${r.input.learning_goal || 'N/A'}\`
- **Result:** ${r.passed ? '✅ **PASSED**' : '❌ **FAILED**'} (${r.duration_ms}ms)
- **Evaluation Notes:** > ${r.notes}
${r.rubric ? `- **Rubric Scores:** Topic: ${r.rubric.relevance_to_topic}/5 | Level: ${r.rubric.match_to_proficiency}/5 | Goal: ${r.rubric.match_to_goal}/5 | Links: ${r.rubric.link_validity}/5 | Clarity: ${r.rubric.clarity}/5 | **Total: ${r.rubric.overall_score}/100**` : ''}
`).join('\n---\n')}

## 3. Rubric Evaluation Methodology
- **Relevance to Topic (0-5):** Lexical and semantic presence of target subject concepts across resource titles and justifications.
- **Match to Proficiency (0-5):** Pedagogical alignment (beginner fundamentals vs advanced architectures).
- **Match to Goal (0-5):** Tailoring for exams, projects, or career interviews.
- **Link Validity (0-5):** Active HTTP 200 verification via asynchronous HEAD requests; honest null omission is rewarded over fabricated 404 links.
- **Clarity (0-5):** Actionability of explanations, prerequisites, and realistic time commitments.
`;

  fs.writeFileSync(reportPath, reportMarkdown, 'utf-8');

  // Log to database/storage
  await saveRun({
    id: `test_run_${Date.now()}`,
    created_at: timestamp,
    topic: 'Automated 5-Case Test Suite',
    proficiency: 'Advanced',
    learning_goal: 'Automated Verification & Quality Assessment',
    prompt_version: 'v3',
    resources: [],
    rubric_scores: {
      relevance_to_topic: 5,
      match_to_proficiency: 5,
      match_to_goal: 5,
      link_validity: 5,
      clarity: 5,
      overall_score: 100,
      breakdown_notes: ['All 5 test cases completed.'],
    },
    overall_quality_score: Math.round((passedCount / results.length) * 100),
    stages_completed: [],
    storage_target: 'local_storage',
    ai_model_used: 'automated-test-runner',
  });

  return NextResponse.json({
    success: true,
    passed_count: passedCount,
    total_count: results.length,
    results,
  });
}

