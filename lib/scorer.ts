import { RecommendationRequest, ResourceItem, RubricScores } from './types';

/**
 * Calculates transparent rubric scores for a set of recommended resources.
 */
export function calculateRubricScores(
  request: RecommendationRequest,
  resources: ResourceItem[]
): RubricScores {
  const notes: string[] = [];

  if (!resources || resources.length === 0) {
    return {
      relevance_to_topic: 0,
      match_to_proficiency: 0,
      match_to_goal: 0,
      link_validity: 0,
      clarity: 0,
      overall_score: 0,
      breakdown_notes: ['No resources provided to score.'],
    };
  }

  const topicKeywords = request.topic.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const goalLower = request.learning_goal.toLowerCase();
  const proficiency = request.proficiency;

  // 1. Relevance to topic (0 to 5)
  let topicMatches = 0;
  let totalRelevanceReported = 0;

  for (const r of resources) {
    totalRelevanceReported += r.relevance_score || 7;
    const textToSearch = `${r.title} ${r.why_it_fits}`.toLowerCase();
    const hasKeyword = topicKeywords.some(kw => textToSearch.includes(kw));
    if (hasKeyword) topicMatches++;
  }

  const keywordRatio = topicMatches / resources.length;
  const avgReportedRel = totalRelevanceReported / (resources.length * 10); // 0-1
  const relevanceRaw = (keywordRatio * 0.5 + avgReportedRel * 0.5) * 5;
  const relevance_to_topic = Number(Math.min(5, Math.max(1, relevanceRaw)).toFixed(1));
  notes.push(`Relevance: ${relevance_to_topic}/5 (${topicMatches}/${resources.length} resources explicitly matched topic concepts)`);

  // 2. Match to proficiency (0 to 5)
  let profMatches = 0;
  for (const r of resources) {
    const diff = (r.difficulty || '').toLowerCase();
    if (diff.includes(proficiency.toLowerCase())) {
      profMatches++;
    } else if (proficiency === 'Intermediate' && (diff.includes('beginner') || diff.includes('advanced'))) {
      profMatches += 0.5; // partial credit
    } else if (proficiency === 'Beginner' && (r.type === 'course' || r.type === 'video' || r.type === 'docs')) {
      profMatches += 0.5;
    }
  }
  const profRatio = profMatches / resources.length;
  const match_to_proficiency = Number(Math.min(5, Math.max(1, profRatio * 5)).toFixed(1));
  notes.push(`Proficiency: ${match_to_proficiency}/5 (${Math.round(profRatio * 100)}% difficulty alignment with ${proficiency})`);

  // 3. Match to goal (0 to 5)
  let goalFitPoints = 0;
  const isExam = /exam|test|midterm|final|quiz|grade|gpa/i.test(goalLower);
  const isProject = /project|build|create|portfolio|app|saas|deploy/i.test(goalLower);
  const isJob = /job|interview|career|internship|hire|resume/i.test(goalLower);

  for (const r of resources) {
    const why = r.why_it_fits.toLowerCase();
    if (isExam && (r.type === 'book' || r.type === 'course' || r.type === 'docs' || why.includes('exam') || why.includes('theory'))) {
      goalFitPoints += 1;
    } else if (isProject && (r.type === 'practice' || r.type === 'video' || why.includes('build') || why.includes('project') || why.includes('code'))) {
      goalFitPoints += 1;
    } else if (isJob && (r.type === 'practice' || why.includes('interview') || why.includes('industry') || why.includes('portfolio'))) {
      goalFitPoints += 1;
    } else if (why.length > 25) {
      goalFitPoints += 0.7; // general thoughtful reason
    }
  }

  const goalRatio = goalFitPoints / resources.length;
  const match_to_goal = Number(Math.min(5, Math.max(1, goalRatio * 5)).toFixed(1));
  notes.push(`Goal Match: ${match_to_goal}/5 (Target goal criteria satisfied)`);

  // 4. Link validity (0 to 5)
  let validPoints = 0;
  for (const r of resources) {
    if (r.link_status === 'verified_200') {
      validPoints += 1.0;
    } else if (r.link_status === 'null_or_unverified') {
      // Responsible AI credit: intentionally nulling unverified URLs is better than hallucinations!
      validPoints += 0.7;
    } else if (r.link_status === 'dead_link') {
      validPoints += 0.2; // penalty for 404s
    } else {
      validPoints += 0.5;
    }
  }
  const linkRatio = validPoints / resources.length;
  const link_validity = Number(Math.min(5, Math.max(0, linkRatio * 5)).toFixed(1));
  const verifiedCount = resources.filter(r => r.link_status === 'verified_200').length;
  notes.push(`Link Validity: ${link_validity}/5 (${verifiedCount}/${resources.length} active 200 OK links)`);

  // 5. Clarity (0 to 5)
  let clarityPoints = 0;
  for (const r of resources) {
    const whyLength = (r.why_it_fits || '').length;
    const hasTime = (r.estimated_time || '').length > 2;
    if (whyLength > 40 && hasTime) {
      clarityPoints += 1.0;
    } else if (whyLength > 20) {
      clarityPoints += 0.7;
    } else {
      clarityPoints += 0.3;
    }
  }
  const clarityRatio = clarityPoints / resources.length;
  const clarity = Number(Math.min(5, Math.max(1, clarityRatio * 5)).toFixed(1));
  notes.push(`Clarity: ${clarity}/5 (Detail of pedagogical justification and time estimates)`);

  // Overall Quality Score (0 to 100%)
  const totalPoints = relevance_to_topic + match_to_proficiency + match_to_goal + link_validity + clarity;
  const overall_score = Math.round((totalPoints / 25) * 100);

  return {
    relevance_to_topic,
    match_to_proficiency,
    match_to_goal,
    link_validity,
    clarity,
    overall_score,
    breakdown_notes: notes,
  };
}

