# Personalized Learning Resource Recommender - Test Suite Report

> **Execution Timestamp:** `2026-10-30T09:05:47.167Z`  
> **Overall Result:** **5/5 Passed (100%)**  
> **Environment:** Next.js App Router, Gemini API with Rubric Scorer, Link Verification Engine

---

## 1. Test Summary

| Test ID | Case Description | Status | Latency | Key Observations |
| :--- | :--- | :---: | :---: | :--- |
| `case_1_beginner_topic` | **Beginner Topic: Python Basics for Undergraduates** | ✅ PASS | 7110ms | Generated 5 verified resources. Quality Score: 97/100. All assertions satisfied. |
| `case_2_advanced_topic` | **Advanced Topic: Distributed Consensus (Raft & Paxos)** | ✅ PASS | 5836ms | Generated 5 verified resources. Quality Score: 91/100. All assertions satisfied. |
| `case_3_vague_goal` | **Vague Goal: Machine Learning Foundations** | ✅ PASS | 3987ms | Generated 5 verified resources. Quality Score: 90/100. All assertions satisfied. |
| `case_4_two_goals` | **Two Goals at Once: Full-Stack React & Node** | ✅ PASS | 5958ms | Generated 5 verified resources. Quality Score: 90/100. All assertions satisfied. |
| `case_5_edge_case_nonsense` | **Edge Case: Empty or Nonsense Input** | ✅ PASS | 6ms | Correctly rejected invalid input with HTTP 400: "Invalid topic: the input appears to be random characters or nonsense. Please enter a valid academic or professional topic." |

---

## 2. Detailed Case Analysis


### Test Case 1: Beginner Topic: Python Basics for Undergraduates (`case_1_beginner_topic`)

- **Input Parameters:**
  - Topic: `Python Programming Fundamentals`
  - Proficiency: `Beginner`
  - Learning Goal: `Pass introductory CS university midterm exam`
  - Prompt Version: `v3`
- **Result:** ✅ **PASSED** (7110ms)
- **Detailed Evaluation Notes:**
  > Generated 5 verified resources. Quality Score: 97/100. All assertions satisfied.

- **Rubric Breakdown:**
  - Topic Relevance: **4.8/5**
  - Proficiency Alignment: **5/5**
  - Goal Alignment: **4.7/5**
  - Link Integrity: **4.7/5**
  - Pedagogical Clarity: **5/5**
  - **Composite Quality Score:** **97/100**


---

### Test Case 2: Advanced Topic: Distributed Consensus (Raft & Paxos) (`case_2_advanced_topic`)

- **Input Parameters:**
  - Topic: `Distributed Consensus Algorithms: Raft and Paxos`
  - Proficiency: `Advanced`
  - Learning Goal: `Build a fault-tolerant distributed replicated state machine`
  - Prompt Version: `v3`
- **Result:** ✅ **PASSED** (5836ms)
- **Detailed Evaluation Notes:**
  > Generated 5 verified resources. Quality Score: 91/100. All assertions satisfied.

- **Rubric Breakdown:**
  - Topic Relevance: **4.8/5**
  - Proficiency Alignment: **5/5**
  - Goal Alignment: **4.1/5**
  - Link Integrity: **3.9/5**
  - Pedagogical Clarity: **5/5**
  - **Composite Quality Score:** **91/100**


---

### Test Case 3: Vague Goal: Machine Learning Foundations (`case_3_vague_goal`)

- **Input Parameters:**
  - Topic: `Machine Learning and Neural Networks`
  - Proficiency: `Intermediate`
  - Learning Goal: `Just want to know some AI stuff and see what is out there`
  - Prompt Version: `v3`
- **Result:** ✅ **PASSED** (3987ms)
- **Detailed Evaluation Notes:**
  > Generated 5 verified resources. Quality Score: 90/100. All assertions satisfied.

- **Rubric Breakdown:**
  - Topic Relevance: **4.8/5**
  - Proficiency Alignment: **5/5**
  - Goal Alignment: **3.5/5**
  - Link Integrity: **4.2/5**
  - Pedagogical Clarity: **5/5**
  - **Composite Quality Score:** **90/100**


---

### Test Case 4: Two Goals at Once: Full-Stack React & Node (`case_4_two_goals`)

- **Input Parameters:**
  - Topic: `Modern Full-Stack Development with React and Node.js`
  - Proficiency: `Intermediate`
  - Learning Goal: `Pass senior frontend tech interview and build a SaaS portfolio product`
  - Prompt Version: `v3`
- **Result:** ✅ **PASSED** (5958ms)
- **Detailed Evaluation Notes:**
  > Generated 5 verified resources. Quality Score: 90/100. All assertions satisfied.

- **Rubric Breakdown:**
  - Topic Relevance: **4.8/5**
  - Proficiency Alignment: **4/5**
  - Goal Alignment: **4.7/5**
  - Link Integrity: **3.9/5**
  - Pedagogical Clarity: **5/5**
  - **Composite Quality Score:** **90/100**


---

### Test Case 5: Edge Case: Empty or Nonsense Input (`case_5_edge_case_nonsense`)

- **Input Parameters:**
  - Topic: `asdfghjkl1234!@#$%^&*`
  - Proficiency: `Beginner`
  - Learning Goal: `pass an exam`
  - Prompt Version: `v3`
- **Result:** ✅ **PASSED** (6ms)
- **Detailed Evaluation Notes:**
  > Correctly rejected invalid input with HTTP 400: "Invalid topic: the input appears to be random characters or nonsense. Please enter a valid academic or professional topic."



## 3. Rubric Evaluation Methodology

1. **Relevance to Topic (0-5):** Lexical and semantic presence of target subject concepts across resource titles and justifications.
2. **Match to Proficiency (0-5):** Pedagogical alignment (beginner fundamentals vs advanced distributed consensus architectures).
3. **Match to Goal (0-5):** Tailoring for exams (theory, textbooks, past papers), projects (code repositories, hands-on tutorials), or career interviews (system design, algorithmic practice).
4. **Link Validity (0-5):** Active HTTP 200 verification via asynchronous HEAD requests; honest null omission is rewarded over fabricated 404 links.
5. **Clarity (0-5):** Actionability of explanations, prerequisites, and realistic time commitments.

## 4. Edge Case & Robustness Validation

- **Nonsense Rejection:** The input validator cleanly identifies keyboard smashes (e.g. `asdfghjkl1234!@#$%^&*`), single character repetitions, and random punctuation strings, returning an immediate friendly HTTP 400 error without wasting LLM inference tokens.
- **Ambiguity Resilience:** For vague goals (Case 3), the recommender constructs a balanced curricular foundation across multiple modalities.
- **Multi-Goal Synthesis:** For compound goals (Case 4: interview prep + SaaS portfolio project), the AI allocates resources addressing both theoretical interview questions and practical production engineering.
