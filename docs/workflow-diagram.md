# Personalized Learning Resource Recommender - Pipeline Architecture

This document diagrams the complete multi-stage pipeline, validation logic, asynchronous link integrity verification, rubric scoring engine, and automated notification system.

---

## 1. End-to-End Pipeline Architecture Flowchart

```mermaid
flowchart TD
    subgraph UI ["Client Layer (Next.js App Router)"]
        A["Student Input Form<br/>(Topic, Level, Goal, Email, Prompt Version)"]
        PR["Live 5-Stage Progress Indicator"]
        RES["Ranked Curriculum Cards<br/>(Link Badges & Quality Score)"]
        HIST["History Table & Supabase Sync"]
    end

    subgraph Stage1 ["Stage 1: Collect & Validate Input"]
        V1{"Validation Checks"}
        V1 -->|"Empty / Length / Gibberish smash"| ERR["HTTP 400 Friendly Rejection"]
        V1 -->|"Sanitized Input Valid"| S2["Sanitized Profile"]
    end

    subgraph Stage2 ["Stage 2: Gemini AI Ranking"]
        PL["Prompt Loader<br/>(v1 / v2 / v3 from /prompts)"]
        GEM["Google Gemini API<br/>(gemini-1.5-flash / gemini-2.0-flash)<br/>JSON-Only Schema Mode"]
        FB["Intelligent Fallback Engine<br/>(If API Offline / Quota Limit)"]
        PL --> GEM
        GEM -->|"JSON Candidate Resources"| S3["Raw Resource List"]
        GEM -.->|"429 Rate Limit / Error"| FB
        FB --> S3
    end

    subgraph Stage3 ["Stage 3: Verification & Rubric Quality Scoring"]
        HEAD["Parallel Asynchronous HTTP HEAD / Range GET"]
        LINK_DEC{"URL Status Check"}
        HEAD --> LINK_DEC
        LINK_DEC -->|"200-399 OK"| V200["Verified 200 OK Badge"]
        LINK_DEC -->|"404 / 500 / DNS Fail"| DEAD["Dead Link Flagged + Fallback Query"]
        LINK_DEC -->|"URL Null (v3 Rule)"| UNVER["Anti-Hallucination Safe Fallback"]
        
        RUBRIC["Rubric Scorer Engine (0-5 each)<br/>• Topic Relevance<br/>• Proficiency Alignment<br/>• Goal Fit<br/>• Link Validity<br/>• Pedagogical Clarity"]
        RUBRIC --> SCORE["Overall Quality Score (0-100%)"]
    end

    subgraph Stage4 ["Stage 4: Database Storage"]
        FIREBASE[("Firebase Cloud Firestore ('runs')")]
        LOC[("Local Persistent JSON Storage")]
        FIREBASE -.->|"Connection / Auth Error"| LOC
    end

    subgraph Stage5 ["Stage 5: Automated Action & Delivery"]
        NOTIF{"Notification Channel"}
        NOTIF -->|"RESEND_API_KEY"| RESEND["Resend Email API"]
        NOTIF -->|"N8N_WEBHOOK_URL"| N8N["n8n Webhook Pipeline"]
        NOTIF -->|"Default / Local Mode"| LOG["Proof Log & Unique TxID"]
    end

    A --> V1
    S2 --> PL
    S3 --> HEAD
    V200 & DEAD & UNVER --> RUBRIC
    SCORE --> SUPA & LOC
    SUPA & LOC --> NOTIF
    NOTIF --> PR & RES & HIST
```

---

## 2. Sequence Diagram: Interaction Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Student as College Student
    participant Browser as Next.js Client
    participant API as /api/recommend
    participant Val as Input Validator
    participant Gemini as Google Gemini API
    participant Verifier as HTTP HEAD Verifier
    participant Scorer as Rubric Scorer
    participant DB as Supabase ("runs")
    participant Notifier as Notifier (Resend / n8n)

    Student->>Browser: Enters Topic, Proficiency, Goal & Email
    Browser->>API: POST /api/recommend (JSON payload)
    
    API->>Val: Stage 1: Validate payload
    alt Invalid or Gibberish Input
        Val-->>API: Validation Failed (e.g. keyboard smash)
        API-->>Browser: HTTP 400 + Friendly Error Message
        Browser-->>Student: Displays guidance banner
    else Valid Profile
        Val-->>API: Sanitized Input Profile
    end

    API->>Gemini: Stage 2: Call Gemini API with structured prompt (v1/v2/v3)
    Gemini-->>API: JSON Output with 5 candidate resources

    API->>Verifier: Stage 3: Send asynchronous HEAD requests to all URLs
    Verifier-->>API: HTTP status codes (200, 404, null) & fallback search queries

    API->>Scorer: Compute 5-factor rubric & composite quality score
    Scorer-->>API: Rubric breakdown (Relevance, Level, Goal, Links, Clarity)

    API->>DB: Stage 4: Persist run record, link checks, scores & timestamp
    DB-->>API: Confirmation & record ID

    opt Student Email Provided
        API->>Notifier: Stage 5: Dispatch automated email / webhook
        Notifier-->>API: Execution proof & transaction ID
    end

    API-->>Browser: Returns complete run payload + stage logs
    Browser-->>Student: Renders ranked cards, link badges, rubric score & proof
```

---

## 3. Five-Stage Pipeline Summary

| Stage | Responsibility | Failure Mode Handling |
| :--- | :--- | :--- |
| **Stage 1: Input Validation** | Reject empty strings, single characters, and keyboard smash nonsense (`asdfghjkl`, repetitive punctuation). | Returns friendly HTTP 400 with guidance without spending LLM tokens. |
| **Stage 2: Gemini AI Ranking** | Synthesize ranked educational resources using prompt templates `v1`, `v2`, or `v3`. | Graceful fallback to verified curated catalog on 429 quota limit or network timeout. |
| **Stage 3: Verification & Scoring** | Execute asynchronous HEAD/GET requests (with 4s timeout) against all resource URLs. Compute 5-factor rubric score. | Flags non-200 links with red badge; attaches fallback Google Search queries; credits prompt v3 honest nulls. |
| **Stage 4: Storage** | Insert full run data, link check logs, and rubric scores to Supabase table `runs`. | Fallback to `data/runs.json` if Supabase environment variables are unconfigured. |
| **Stage 5: Automated Action** | Dispatch structured HTML summary to student email via Resend or n8n webhook. | Logs cryptographically verifiable delivery proof transaction ID. |

