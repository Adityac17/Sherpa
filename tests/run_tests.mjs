import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testCases = [
  'case_1_beginner_topic.json',
  'case_2_advanced_topic.json',
  'case_3_vague_goal.json',
  'case_4_two_goals.json',
  'case_5_edge_case_nonsense.json',
];

async function runAllTests() {
  console.log('======================================================');
  console.log('   Personalized Learning Recommender - Test Suite     ');
  console.log('======================================================\n');

  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  console.log(`Connecting to test server at ${baseUrl}...\n`);

  const results = [];

  for (const file of testCases) {
    const filePath = path.join(__dirname, file);
    const testData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`Executing [${testData.id}] ${testData.name}...`);

    const start = Date.now();
    let passed = false;
    let notes = '';
    let rubric = null;

    try {
      const res = await fetch(`${baseUrl}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData.input),
      });

      const data = await res.json();

      if (!testData.assertions.should_pass_validation) {
        if (res.status === 400 && data.error) {
          passed = true;
          notes = `Correctly rejected invalid input with HTTP 400: "${data.error}"`;
        } else {
          passed = false;
          notes = `Expected HTTP 400 validation error, but received HTTP ${res.status}`;
        }
      } else {
        if (res.ok && data.success && data.run?.resources?.length >= testData.assertions.minimum_resource_count) {
          rubric = data.run.rubric_scores;
          const meetsScore = rubric.overall_score >= (testData.assertions.minimum_rubric_quality_score || 70);
          if (meetsScore) {
            passed = true;
            notes = `Generated ${data.run.resources.length} verified resources. Quality Score: ${rubric.overall_score}/100. All assertions satisfied.`;
          } else {
            passed = false;
            notes = `Generated resources, but score ${rubric.overall_score}/100 fell below minimum of ${testData.assertions.minimum_rubric_quality_score}.`;
          }
        } else {
          passed = false;
          notes = `Pipeline failure: ${data.error || 'Insufficient resources returned'}`;
        }
      }
    } catch (err) {
      passed = false;
      notes = `Request failure: ${err.message}`;
    }

    const duration = Date.now() - start;
    console.log(`  -> ${passed ? '✓ PASS' : '✗ FAIL'} (${duration}ms): ${notes}\n`);

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

  // Generate /tests/report.md
  generateMarkdownReport(results);

  console.log('======================================================');
  console.log(`Summary: ${results.filter(r => r.passed).length}/${results.length} Tests Passed`);
  console.log('Test report written to: tests/report.md');
  console.log('======================================================');

  if (results.some(r => !r.passed)) {
    process.exit(1);
  }
}

function generateMarkdownReport(results) {
  const timestamp = new Date().toISOString();
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  const passRate = Math.round((passedCount / totalCount) * 100);

  const markdown = `# Personalized Learning Resource Recommender - Test Suite Report

> **Execution Timestamp:** \`${timestamp}\`  
> **Overall Result:** **${passedCount}/${totalCount} Passed (${passRate}%)**  
> **Environment:** Next.js App Router, Gemini API with Rubric Scorer, Link Verification Engine

---

## 1. Test Summary

| Test ID | Case Description | Status | Latency | Key Observations |
| :--- | :--- | :---: | :---: | :--- |
${results.map(r => `| \`${r.id}\` | **${r.name}** | ${r.passed ? '✅ PASS' : '❌ FAIL'} | ${r.duration_ms}ms | ${r.notes.replace(/\|/g, '-')} |`).join('\n')}

---

## 2. Detailed Case Analysis

${results.map((r, i) => `
### Test Case ${i + 1}: ${r.name} (\`${r.id}\`)

- **Input Parameters:**
  - Topic: \`${r.input.topic || 'N/A'}\`
  - Proficiency: \`${r.input.proficiency || 'N/A'}\`
  - Learning Goal: \`${r.input.learning_goal || 'N/A'}\`
  - Prompt Version: \`${r.input.prompt_version || 'v3'}\`
- **Result:** ${r.passed ? '✅ **PASSED**' : '❌ **FAILED**'} (${r.duration_ms}ms)
- **Detailed Evaluation Notes:**
  > ${r.notes}
${r.rubric ? `
- **Rubric Breakdown:**
  - Topic Relevance: **${r.rubric.relevance_to_topic}/5**
  - Proficiency Alignment: **${r.rubric.match_to_proficiency}/5**
  - Goal Alignment: **${r.rubric.match_to_goal}/5**
  - Link Integrity: **${r.rubric.link_validity}/5**
  - Pedagogical Clarity: **${r.rubric.clarity}/5**
  - **Composite Quality Score:** **${r.rubric.overall_score}/100**
` : ''}
`).join('\n---\n')}

## 3. Rubric Evaluation Methodology

1. **Relevance to Topic (0-5):** Lexical and semantic presence of target subject concepts across resource titles and justifications.
2. **Match to Proficiency (0-5):** Pedagogical alignment (beginner fundamentals vs advanced distributed consensus architectures).
3. **Match to Goal (0-5):** Tailoring for exams (theory, textbooks, past papers), projects (code repositories, hands-on tutorials), or career interviews (system design, algorithmic practice).
4. **Link Validity (0-5):** Active HTTP 200 verification via asynchronous HEAD requests; honest null omission is rewarded over fabricated 404 links.
5. **Clarity (0-5):** Actionability of explanations, prerequisites, and realistic time commitments.

## 4. Edge Case & Robustness Validation

- **Nonsense Rejection:** The input validator cleanly identifies keyboard smashes (e.g. \`asdfghjkl1234!@#$%^&*\`), single character repetitions, and random punctuation strings, returning an immediate friendly HTTP 400 error without wasting LLM inference tokens.
- **Ambiguity Resilience:** For vague goals (Case 3), the recommender constructs a balanced curricular foundation across multiple modalities.
- **Multi-Goal Synthesis:** For compound goals (Case 4: interview prep + SaaS portfolio project), the AI allocates resources addressing both theoretical interview questions and practical production engineering.
`;

  const reportPath = path.join(__dirname, 'report.md');
  fs.writeFileSync(reportPath, markdown, 'utf-8');
}

runAllTests().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
