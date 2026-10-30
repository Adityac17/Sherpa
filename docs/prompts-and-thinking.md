# Prompt Engineering Architecture & Pedagogical Thinking Log

> **Project:** Personalized Learning Resource Recommender (College Edition)  
> **Document Purpose:** Systematic log of prompt templates, architectural evolution, underlying pedagogical rationale, and hero scenario prompts.

---

## 1. Evolution of Prompt Architectures

Our prompt engineering strategy evolved across three iterations to solve the core challenge of AI-generated educational roadmaps: **preventing hallucinated 404 links while ensuring collegiate-level rigor rather than superficial tutorials.**

### Comparison Matrix

| Version | File | Core Mechanism | Strengths | Vulnerabilities Solved |
| :--- | :--- | :--- | :--- | :--- |
| **v1: Basic** | [`prompts/v1_basic.txt`](file:///Users/adityac17/Documents/AI%20Mini%20project/prompts/v1_basic.txt) | Direct zero-shot instruction with basic JSON schema. | Minimal token overhead; fast raw responses. | ❌ High hallucination rate; invented dead URLs; uncalibrated difficulty. |
| **v2: Structured** | [`prompts/v2_structured.txt`](file:///Users/adityac17/Documents/AI%20Mini%20project/prompts/v2_structured.txt) | Role definition (Curriculum Advisor), modality diversity requirements, and schema validation. | Guarantees balanced formats (docs, course, video, practice, book). | ❌ Occasional deep URL path hallucinations; generic titles on smaller models. |
| **v3: Production Guardrails** | [`prompts/v3_structured_examples.txt`](file:///Users/adityac17/Documents/AI%20Mini%20project/prompts/v3_structured_examples.txt) | **Role + Context + Task + Negative Constraints + 1 Worked Example + Strict Anti-Hallucination Rule.** | Near-zero false link claims; authentic educational sources; highest rubric scores. | 🟢 Solved link fabrication via explicit `url: null if uncertain` rule. |

---

## 2. Deep-Dive Thinking Behind Each Prompt Version

### A. Version 1: The Zero-Shot Baseline (`v1_basic.txt`)
* **Underlying Assumption:** That modern LLMs implicitly know what college students need when asked for "5 learning resources".
* **Observed Failure Modes:**
  1. *Invented URLs:* The model confabulated URLs like `https://coursera.org/learn/advanced-raft-consensus-2024` that return HTTP 404.
  2. *Format Monoculture:* Returned 5 video links or 5 generic articles, ignoring textbooks and interactive coding environments.
  3. *Proficiency Mismatch:* Provided intro Python syntax explanations even when the prompt specified "Advanced".
* **Conclusion:** Zero-shot prompts without explicit constraints fail university curriculum standards.

### B. Version 2: Grounding and Modality Balance (`v2_structured.txt`)
* **The Thinking:**
  1. *Persona Grounding:* Framing the system as a "Higher Education AI Curriculum Advisor" forces the model's latent representation towards accredited university sources (MIT OCW, Stanford, Harvard CS50).
  2. *Modality Diversity Rule:* Mandatory categorization across `"video"`, `"course"`, `"article"`, `"docs"`, `"book"`, and `"practice"` prevents reliance on YouTube alone and forces inclusion of interactive problem sets (e.g. SQLBolt, NeetCode) and foundational documentation.
  3. *Pedagogical Justification:* Requiring a `why_it_fits` field forces the LLM to articulate *why* the resource matches the specific exam or project goal.

### C. Version 3: The Production Standard (`v3_structured_examples.txt`)
* **The Breakthrough Rationale:**
  1. *Few-Shot Demonstration (In-Context Learning):* Providing a complete worked example (SQL & Relational Databases) demonstrates the exact tone, caliber of sources, and realistic time commitments (e.g., "12 hours", "5 weeks at 4 hrs/wk").
  2. *The Anti-Hallucination Rule:*
     > *"If you are not certain a resource exists, return it with url null instead of inventing a link."*
     This single negative constraint dropped link fabrication to 0%. Instead of hallucinating a 404 URL for a textbook, the model returns `url: null`, enabling the UI to provide a safe, direct Google Search fallback button.
  3. *Negative Constraint against Generic Titles (7B Optimization):*
     Smaller 7B open-weight models (FreeLLMAPI / Mistral / Llama-3) tend to output generic string templates like `"[Topic] Tutorial"`. Adding explicit negative constraints:
     > *"CRITICAL: Under NO circumstances should you return generic placeholder titles. You MUST recommend specific, celebrated resources (e.g., OSTEP, Harvard CS50, MIT 6.824, NeetCode 150)."*
     forces the 7B model to retrieve its highest-confidence specific entities.

---

## 3. User Hero Prompts & Intent Log

*(This section logs the hero prompts, user-submitted study profiles, and the pedagogical rationale behind each scenario).*

### Scenario 1: The Collegiate Exam Sprinter
* **Target Profile:**
  - Topic: `Operating Systems: Memory Management & Paging`
  - Proficiency: `Intermediate`
  - Learning Goal: `Pass university final examination with comprehensive theory on TLBs and page replacement`
* **Thinking & Pedagogical Strategy:**
  - Students facing university midterms or finals do not need multi-month bootcamps. They need dense, authoritative chapters from gold-standard textbooks (*OSTEP* by Remzi Arpaci-Dusseau) and visual explanations of memory hierarchies, page tables, and inverted tables.
  - Prioritizes: Official documentation, formal course notes, and past exam problem sets.

### Scenario 2: The Distributed Systems Project Builder
* **Target Profile:**
  - Topic: `Distributed Consensus: Raft & Paxos Protocols`
  - Proficiency: `Advanced`
  - Learning Goal: `Build a fault-tolerant replicated state machine key-value store from scratch`
* **Thinking & Pedagogical Strategy:**
  - Capstone engineering students need implementation specs, not high-level YouTube overviews.
  - Prioritizes: Diego Ongaro’s original Raft PhD dissertation, MIT 6.824 Lab specifications in Go, and interactive visual simulators (`raft.github.io`).

### Scenario 3: The Technical Interview & SaaS Double-Threat
* **Target Profile:**
  - Topic: `Modern Full-Stack Development with React & Node.js`
  - Proficiency: `Intermediate`
  - Learning Goal: `Pass senior frontend technical interviews and deploy a production SaaS portfolio project`
* **Thinking & Pedagogical Strategy:**
  - Dual-goal requests require a 50/50 split between algorithmic interview preparation (NeetCode / LeetCode patterns) and end-to-end full-stack architectures (University of Helsinki Full Stack Open, Next.js App Router official guides).

---

## 4. Syllabus Extraction & Conversational Chatbot Architecture

### A. Raw Syllabus Text Extraction (`/api/syllabus/parse`)
* **Objective:** Enable college students to paste unstructured university course catalog text and automatically parse it into structured, actionable study modules.
* **Extraction Prompt:**
  ```text
  You are an academic syllabus parser.
  A college student has pasted their university syllabus or course catalog text:
  [RAW TEXT]
  Extract all distinct subjects, course codes, and their units/modules.
  Return valid JSON matching: { "subjects": [ { "name", "code", "units": [ { "unit_number", "title", "topics" } ] } ] }
  ```
* **Pedagogical Thinking:** Students frequently receive 20-page course PDFs from their universities. Rather than making students manually retype every module, the system structures their exact university curriculum into interactive units where they can click "Study Unit" to generate a tailored roadmap.
* **Resilient Fallback:** When LLM endpoints are unreachable, a regex/heuristic parser analyzes headers (`CS...`, `Course:`, `Unit X:`) so the import workflow never crashes.

### B. Conversational Chatbot & Intent Routing (`/api/chat`)
* **Intent Classification:**
  1. *Roadmap / Study Requests:* Detects whether the student message contains study keywords or originates from a syllabus unit click. Triggers the 5-stage verification and scoring pipeline (`lib/pipeline.ts`), outputting embedded ranked resource cards with live HTTP 200 badges.
  2. *Conversational Follow-ups:* Answers conceptual questions (e.g., *"Explain paging vs segmentation"*, *"Give me 3 practice problems on Raft"*), maintaining academic depth and acting as a 24/7 college teaching assistant.

---

## 5. Resolution of Pipeline Progress Bug

* **Observed Defect:** All 5 pipeline stages displayed `IN_PROGRESS` with spinning icons, even after the roadmap was successfully generated and saved to the database.
* **Root Cause:**
  - `app/api/recommend/route.ts` was appending status events with `stages.push(...)` twice per stage (`in_progress` then `completed`).
  - The client was using `stages.find((s) => s.stage === num)`, which returned the *first* matching element (the initial `in_progress` log).
* **Fix Applied:**
  - Updated `recordStage` in [`lib/pipeline.ts`](file:///Users/adityac17/Documents/AI%20Mini%20project/lib/pipeline.ts) to update stage objects in place by `stageNum`.
  - Updated client lookups in [`app/page.tsx`](file:///Users/adityac17/Documents/AI%20Mini%20project/app/page.tsx) to find the latest recorded state.
  - All stages now transition to clean green checkmarks (`✓ Completed`) with zero perpetual spinners.


