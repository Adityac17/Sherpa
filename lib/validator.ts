import { RecommendationRequest } from './types';

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  sanitizedInput?: RecommendationRequest;
}

/**
 * Checks if a string resembles keyboard smash or random gibberish.
 */
function isNonsenseString(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 2) return true;

  // Single character repeated
  if (/^(.)\1+$/.test(trimmed)) return true;

  // Common keyboard mash sequences
  const keyboardMashRegex = /asdf|hjkl|qwerty|zxcv|12345|poiuy|lkjh/i;
  if (keyboardMashRegex.test(trimmed) && trimmed.length < 15 && !trimmed.includes(' ')) {
    return true;
  }

  // Pure special characters or punctuation
  const lettersAndDigits = trimmed.replace(/[^a-zA-Z0-9]/g, '');
  if (lettersAndDigits.length === 0) return true;

  // Ratio of punctuation/special characters
  const specialChars = trimmed.replace(/[a-zA-Z0-9\s]/g, '');
  if (trimmed.length > 5 && specialChars.length / trimmed.length > 0.4) {
    return true;
  }

  // Consonant clusters: In English and common academic terms, 6+ consonants in a row is almost always gibberish
  // (unless it contains known technical acronyms, but single word with 6+ consonants like 'sdfghjkl' is gibberish)
  const words = trimmed.split(/\s+/);
  for (const word of words) {
    const lettersOnly = word.replace(/[^a-zA-Z]/g, '');
    if (lettersOnly.length >= 6) {
      const vowels = lettersOnly.match(/[aeiouyAEIOUY]/g);
      if (!vowels || vowels.length === 0) {
        return true;
      }
      // Vowel ratio extremely low in a long single token
      if (vowels.length / lettersOnly.length < 0.15 && lettersOnly.length > 7) {
        return true;
      }
    }
  }

  return false;
}

export function validateRecommendationInput(data: any): ValidationResult {
  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errorMessage: 'Invalid request payload. Please submit a topic, proficiency, and learning goal.'
    };
  }

  const topic = typeof data.topic === 'string' ? data.topic.trim() : '';
  const proficiency = typeof data.proficiency === 'string' ? data.proficiency.trim() : 'Beginner';
  const learning_goal = typeof data.learning_goal === 'string' ? data.learning_goal.trim() : '';
  const student_email = typeof data.student_email === 'string' ? data.student_email.trim() : '';
  const prompt_version = ['v1', 'v2', 'v3'].includes(data.prompt_version) ? data.prompt_version : 'v3';

  // 1. Topic empty check
  if (!topic) {
    return {
      isValid: false,
      errorMessage: 'Please enter a learning topic. The topic field cannot be empty.'
    };
  }

  // 2. Topic length checks
  if (topic.length < 2) {
    return {
      isValid: false,
      errorMessage: 'The topic is too short. Please enter a complete subject name (e.g., "Data Structures", "Quantum Computing").'
    };
  }

  if (topic.length > 250) {
    return {
      isValid: false,
      errorMessage: 'The topic exceeds the maximum allowable length (250 characters).'
    };
  }

  // 3. Topic nonsense check
  if (isNonsenseString(topic)) {
    return {
      isValid: false,
      errorMessage: 'Invalid topic: the input appears to be random characters or nonsense. Please enter a valid academic or professional topic.'
    };
  }

  // 4. Proficiency level check
  const validProficiencies = ['Beginner', 'Intermediate', 'Advanced'];
  const matchedProficiency = validProficiencies.find(
    p => p.toLowerCase() === proficiency.toLowerCase()
  ) as 'Beginner' | 'Intermediate' | 'Advanced' | undefined;

  if (!matchedProficiency) {
    return {
      isValid: false,
      errorMessage: `Proficiency must be one of: Beginner, Intermediate, or Advanced. Received "${proficiency}".`
    };
  }

  // 5. Learning goal check
  if (!learning_goal) {
    return {
      isValid: false,
      errorMessage: 'Please enter your learning goal (e.g., "pass an exam", "build a project", "get a job").'
    };
  }

  if (isNonsenseString(learning_goal) && learning_goal.length > 5) {
    return {
      isValid: false,
      errorMessage: 'Invalid learning goal: please describe a clear objective (e.g. "Prepare for upcoming midterms", "Build a production-ready web application").'
    };
  }

  // 6. Email validation (if provided)
  if (student_email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(student_email)) {
      return {
        isValid: false,
        errorMessage: 'The email address provided is not in a valid format.'
      };
    }
  }

  return {
    isValid: true,
    sanitizedInput: {
      topic,
      proficiency: matchedProficiency,
      learning_goal,
      student_email: student_email || undefined,
      prompt_version
    }
  };
}

