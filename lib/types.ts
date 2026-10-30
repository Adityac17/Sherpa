export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type ResourceType = 'video' | 'course' | 'article' | 'docs' | 'book' | 'practice';

export type LinkStatus = 'verified_200' | 'dead_link' | 'null_or_unverified' | 'redirect_ok';

export interface ResourceItem {
  rank: number;
  title: string;
  type: ResourceType;
  url: string | null;
  why_it_fits: string;
  difficulty: string;
  estimated_time: string;
  relevance_score: number; // 0-10
  link_status?: LinkStatus;
  http_code?: number | null;
  fallback_search_url?: string;
  verification_notes?: string;
}

export interface RubricScores {
  relevance_to_topic: number; // 0-5
  match_to_proficiency: number; // 0-5
  match_to_goal: number; // 0-5
  link_validity: number; // 0-5
  clarity: number; // 0-5
  overall_score: number; // 0-100%
  breakdown_notes: string[];
}

export interface RecommendationRequest {
  topic: string;
  proficiency: ProficiencyLevel;
  learning_goal: string;
  student_email?: string;
  prompt_version?: 'v1' | 'v2' | 'v3';
}

export interface PipelineStageProgress {
  stage: number;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  message: string;
  timestamp: string;
}

export interface ExecutionProof {
  status: 'sent' | 'simulated' | 'failed' | 'skipped';
  channel: 'resend_email' | 'n8n_webhook' | 'local_proof_log';
  recipient: string;
  timestamp: string;
  transaction_id: string;
  details: string;
}

export interface RecommendationRun {
  id: string;
  created_at: string;
  topic: string;
  proficiency: ProficiencyLevel;
  learning_goal: string;
  prompt_version: string;
  student_email?: string;
  resources: ResourceItem[];
  rubric_scores: RubricScores;
  overall_quality_score: number;
  stages_completed: PipelineStageProgress[];
  storage_target: 'firebase' | 'local_storage' | 'supabase';
  execution_proof?: ExecutionProof;
  ai_model_used: string;
}

export interface PromptComparisonResult {
  version: 'v1' | 'v2' | 'v3';
  prompt_name: string;
  resources: ResourceItem[];
  rubric_scores: RubricScores;
  overall_quality_score: number;
  generation_time_ms: number;
  verified_links_count: number;
  dead_links_count: number;
}

export interface SyllabusUnit {
  id: string;
  unit_number: number;
  title: string;
  topics: string[];
}

export interface SyllabusSubject {
  id: string;
  name: string;
  code?: string;
  units: SyllabusUnit[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  recommendationRun?: RecommendationRun;
  isGenerating?: boolean;
  stages?: PipelineStageProgress[];
}


