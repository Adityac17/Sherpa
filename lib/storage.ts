import fs from 'fs';
import path from 'path';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit as firestoreLimit,
  Firestore,
} from 'firebase/firestore';
import { RecommendationRun } from './types';

// In serverless environments (e.g. Vercel, AWS Lambda), process.cwd() is read-only.
// Use /tmp/sherpa_data when running in serverless mode, or fallback to process.cwd()/data locally.
const isServerless = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.NETLIFY ||
  process.env.NODE_ENV === 'production'
);

const DATA_DIR = isServerless ? path.join('/tmp', 'sherpa_data') : path.join(process.cwd(), 'data');
const LOCAL_RUNS_FILE = path.join(DATA_DIR, 'runs.json');

// In-memory fallback if all filesystem access fails
let memoryRunsCache: RecommendationRun[] = [];

/**
 * Ensures the data directory and local backup runs file exist.
 */
function ensureLocalFile(): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_RUNS_FILE)) {
      fs.writeFileSync(LOCAL_RUNS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Reads past runs from local storage or memory cache.
 */
function readLocalRuns(): RecommendationRun[] {
  const ready = ensureLocalFile();
  if (ready) {
    try {
      const content = fs.readFileSync(LOCAL_RUNS_FILE, 'utf-8');
      const parsed = JSON.parse(content) || [];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (err) {
      // Continue to memory cache
    }
  }
  return memoryRunsCache;
}

/**
 * Writes run to local storage and in-memory cache.
 */
function saveLocalRun(run: RecommendationRun): void {
  memoryRunsCache.unshift(run);
  if (memoryRunsCache.length > 50) memoryRunsCache = memoryRunsCache.slice(0, 50);

  const ready = ensureLocalFile();
  if (ready) {
    try {
      const runs = readLocalRuns();
      const merged = [run, ...runs.filter((r) => r.id !== run.id)].slice(0, 50);
      fs.writeFileSync(LOCAL_RUNS_FILE, JSON.stringify(merged, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Filesystem read-only or unavailable; preserved in-memory run cache.');
    }
  }
}

/**
 * Initializes Firebase App and Firestore instance using environment credentials.
 * Skips placeholder values gracefully.
 */
function getFirestoreInstance(): Firestore | null {
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (
    !projectId ||
    projectId.trim() === '' ||
    projectId === 'YOUR_FIREBASE_PROJECT_ID' ||
    projectId === 'your-project-id' ||
    projectId.includes('your-project')
  ) {
    return null;
  }

  try {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyDemoKey',
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
      projectId: projectId,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '123456789',
      appId: process.env.FIREBASE_APP_ID || '1:123456789:web:demo',
    };

    const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    return getFirestore(app);
  } catch (err) {
    console.warn('Failed to initialize Firebase SDK Firestore instance:', err);
    return null;
  }
}

/**
 * Saves run record to Firebase Firestore collection "runs" with automatic local backup.
 */
export async function saveRun(run: RecommendationRun): Promise<{
  target: 'firebase' | 'local_storage';
  success: boolean;
  message: string;
}> {
  // Always save locally to ensure resilience
  saveLocalRun(run);

  const db = getFirestoreInstance();
  if (!db) {
    return {
      target: 'local_storage',
      success: true,
      message: 'Saved to local storage (Configure FIREBASE_PROJECT_ID & keys in .env for Firestore cloud sync).',
    };
  }

  try {
    const docRef = doc(db, 'runs', run.id);
    const cleanPayload = {
      id: run.id,
      topic: run.topic,
      proficiency: run.proficiency,
      learning_goal: run.learning_goal,
      prompt_version: run.prompt_version,
      student_email: run.student_email || null,
      resources: run.resources,
      link_checks: run.resources.map(r => ({
        rank: r.rank,
        title: r.title,
        url: r.url,
        status: r.link_status,
        code: r.http_code,
      })),
      rubric_scores: run.rubric_scores,
      overall_quality_score: run.overall_quality_score,
      execution_proof: run.execution_proof || null,
      created_at: run.created_at,
      ai_model_used: run.ai_model_used,
    };

    // 3000ms timeout guard to avoid hanging if Firebase project is invalid
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firebase Firestore write timed out (>3000ms)')), 3000)
    );

    await Promise.race([setDoc(docRef, cleanPayload), timeoutPromise]);

    return {
      target: 'firebase',
      success: true,
      message: 'Successfully persisted to Firebase Firestore collection "runs" and local backup.',
    };
  } catch (err: any) {
    console.warn('Firebase Firestore save error, retained local backup:', err.message);
    return {
      target: 'local_storage',
      success: true,
      message: `Saved locally (Firebase Firestore fallback: ${err.message})`,
    };
  }
}

/**
 * Fetches recent runs from Firebase Firestore or local storage.
 */
export async function getRunsHistory(limitCount = 10): Promise<RecommendationRun[]> {
  const db = getFirestoreInstance();

  if (db) {
    try {
      const runsCol = collection(db, 'runs');
      const q = query(runsCol, orderBy('created_at', 'desc'), firestoreLimit(limitCount));
      
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firebase query timed out (>3000ms)')), 3000)
      );

      const snapshot = (await Promise.race([getDocs(q), timeoutPromise])) as any;

      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap: any) => docSnap.data() as RecommendationRun);
      }
    } catch (err) {
      console.warn('Could not query Firebase Firestore history, reading local backup:', err);
    }
  }

  return readLocalRuns().slice(0, limitCount);
}
