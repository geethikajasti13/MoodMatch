/**
 * Mood Interpretation Service
 * Interprets natural-language user descriptions into structured mood tags,
 * desired experiences, and intensity levels using configurable rule-based dictionaries.
 */

// Configurable Dictionaries for Moods
const MOOD_DICTIONARY = {
  happy: [
    'happy', 'joyful', 'joy', 'cheerful', 'great mood', 'good mood',
    'delighted', 'smiling', 'content', 'upbeat', 'celebrating', 'ecstatic', 'sunny'
  ],
  sad: [
    'sad', 'feeling down', 'down in the dumps', 'gloomy', 'heartbroken',
    'crying', 'unhappy', 'sorrow', 'grief', 'miserable', 'blue', 'depressed', 'tearful'
  ],
  stressed: [
    'stressed', 'overwhelmed', 'exhausted', 'burnt out', 'burnout',
    'drained', 'frazzled', 'swamped', 'hectic day', 'stressful', 'pressure',
    'hard day', 'tough day', 'overworked'
  ],
  lonely: [
    'lonely', 'alone', 'isolated', 'by myself', 'feeling left out',
    'need company', 'miss people', 'solitary', 'disconnected'
  ],
  hopeful: [
    'hopeful', 'optimistic', 'looking forward', 'faith in humanity',
    'brighter tomorrow', 'hope', 'encouraging', 'uplifting', 'positive'
  ],
  motivated: [
    'motivated', 'pumped up', 'productive', 'work hard', 'ambitious',
    'inspired to act', 'get things done', 'crush it', 'driven', 'energetic', 'determined'
  ],
  curious: [
    'curious', 'wondering', 'fascinated', 'learn something', 'solve a mystery',
    'intrigued', 'inquisitive', 'investigate', 'explore', 'pondering'
  ],
  excited: [
    'excited', 'thrilled', 'hyped', 'enthusiastic', "can't wait", 'cant wait',
    'electric', 'buzzing', 'eager', 'hyper', 'stoked'
  ],
  relaxed: [
    'relaxed', 'chill', 'chilling', 'unwind', 'calm', 'peaceful',
    'mellow', 'laid back', 'laid-back', 'tranquil', 'restful', 'serene', 'at ease'
  ],
  bored: [
    'bored', 'nothing to do', 'dull day', 'kill time', 'monotonous',
    'unstimulated', 'listless', 'need entertainment', 'boredom'
  ],
  nostalgic: [
    'nostalgic', 'childhood memories', 'retro', 'throwback', 'old times',
    'the 90s', 'the 2000s', 'classic', 'reminisce', 'sentimental', 'remembering the past', 'good old days'
  ],
  anxious: [
    'anxious', 'nervous', 'on edge', 'panicky', 'restless',
    'worried', 'apprehensive', 'jittery', 'overthinking', 'uneasy'
  ]
};

// Configurable Dictionaries for Desired Experiences
const EXPERIENCE_DICTIONARY = {
  comfort: [
    'comfort', 'comforting', 'wholesome', 'cozy', 'warm hug',
    'feel-good', 'feel good', 'safe place', 'easy watching', 'gentle', 'soothing', 'familiar'
  ],
  inspiration: [
    'inspiration', 'inspiring', 'inspirational', 'motivational',
    'uplifting', 'empowering', 'triumph', 'make a difference', 'triumph of spirit'
  ],
  laughter: [
    'laughter', 'laugh', 'make me laugh', 'makes me laugh', 'funny',
    'hilarious', 'comedy', 'comic relief', 'silly', 'lighthearted', 'humor', 'chuckle', 'giggle'
  ],
  suspense: [
    'suspense', 'thriller', 'edge of my seat', 'plot twist', 'nail biter',
    'solve a mystery', 'mystery', 'detective', 'whodunit', 'tension', 'thrill', 'twists and turns'
  ],
  adventure: [
    'adventure', 'journey', 'quest', 'action-packed', 'action packed',
    'epic', 'explore new worlds', 'fantasy', 'travel', 'discovery', 'expedition'
  ],
  escapism: [
    'escapism', 'escape reality', 'get lost in', 'different world',
    'fantasy realm', 'distraction', 'forget everything', 'lose myself', 'transport me'
  ],
  'emotional connection': [
    'emotional connection', 'deep feelings', 'relatable', 'cry',
    'tearjerker', 'heartfelt', 'touching', 'moving', 'romance', 'soulful', 'meaningful', 'resonate'
  ],
  'intellectual stimulation': [
    'intellectual stimulation', 'thought provoking', 'thought-provoking',
    'mind bending', 'mind-bending', 'documentary', 'learn', 'philosophy',
    'deep thinking', 'complex plot', 'cerebral', 'smart', 'puzzle'
  ]
};

// Negation patterns: words or tokens indicating negative sentiment towards following words
const NEGATION_WORDS = [
  'not', 'no', 'never', "don't", 'dont', "didn't", 'didnt', "won't", 'wont',
  "isn't", 'isnt', "aren't", 'arent', "wasn't", 'wasnt', "weren't", 'werent',
  'stop feeling', 'without', 'hardly', 'barely'
];

// High/Low intensity indicators
const HIGH_INTENSITY_WORDS = [
  'very', 'extremely', 'super', 'intensely', 'deeply', 'so much',
  'overwhelmingly', 'immensely', 'insanely', 'crazy', 'totally',
  'completely', 'unbearably', 'urgently'
];

const LOW_INTENSITY_WORDS = [
  'a bit', 'slightly', 'a little', 'mildly', 'kind of', 'sort of',
  'not too much', 'low key', 'low-key', 'light', 'gentle', 'just a tiny bit', 'somewhat'
];

/**
 * Normalizes text: converts to lowercase, standardizes quotes and whitespace.
 */
function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^a-z0-9'\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks if a match is preceded by a negation word within a window of words.
 */
function isNegated(text, matchIndex) {
  const precedingText = text.slice(Math.max(0, matchIndex - 35), matchIndex).trim();
  const words = precedingText.split(/\s+/);
  const recentWords = words.slice(-3); // Check up to 3 words before match

  for (const word of recentWords) {
    const cleanWord = word.replace(/[^a-z']/g, '');
    if (NEGATION_WORDS.includes(cleanWord)) {
      return true;
    }
  }
  return false;
}

/**
 * Matches dictionary phrases and keywords against normalized text.
 * Filters out negated matches.
 */
function findMatches(normalizedText, dictionary) {
  const matches = new Set();

  for (const [category, phrases] of Object.entries(dictionary)) {
    // Sort phrases by length descending to match multi-word phrases first
    const sortedPhrases = [...phrases].sort((a, b) => b.length - a.length);

    for (const phrase of sortedPhrases) {
      const phraseRegex = new RegExp(`\\b${phrase.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
      let match;
      while ((match = phraseRegex.exec(normalizedText)) !== null) {
        if (!isNegated(normalizedText, match.index)) {
          matches.add(category);
          break; // Found an active, non-negated match for this category
        }
      }
      if (matches.has(category)) break;
    }
  }

  return Array.from(matches);
}

/**
 * Infers intensity level ('low', 'medium', 'high') based on explicit cues.
 */
function inferIntensity(normalizedText) {
  for (const highWord of HIGH_INTENSITY_WORDS) {
    const regex = new RegExp(`\\b${highWord}\\b`, 'i');
    if (regex.test(normalizedText)) {
      return 'high';
    }
  }

  for (const lowWord of LOW_INTENSITY_WORDS) {
    const regex = new RegExp(`\\b${lowWord}\\b`, 'i');
    if (regex.test(normalizedText)) {
      return 'low';
    }
  }

  return 'medium';
}

/**
 * Main mood interpretation function.
 * @param {string} text - User's natural-language response.
 * @returns {object} { inferredMoods: string[], desiredExperiences: string[], intensity: string, isAmbiguous: boolean }
 */
function interpretMood(text) {
  const normalized = normalizeText(text);

  if (!normalized) {
    return {
      inferredMoods: [],
      desiredExperiences: [],
      intensity: 'medium',
      isAmbiguous: true
    };
  }

  const inferredMoods = findMatches(normalized, MOOD_DICTIONARY);
  const desiredExperiences = findMatches(normalized, EXPERIENCE_DICTIONARY);
  const intensity = inferIntensity(normalized);

  // If user says "I want something hopeful", that could imply desired experience of inspiration or comfort
  // If user says "I had a stressful day and want something comforting" -> mood: stressed, experience: comfort
  // If no moods or experiences could be detected, mark as ambiguous
  const isAmbiguous = inferredMoods.length === 0 && desiredExperiences.length === 0;

  return {
    inferredMoods,
    desiredExperiences,
    intensity,
    isAmbiguous
  };
}

module.exports = {
  interpretMood,
  normalizeText,
  MOOD_DICTIONARY,
  EXPERIENCE_DICTIONARY
};
