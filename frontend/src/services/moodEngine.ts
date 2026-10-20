import type { MoodInterpretation, Intensity } from '@/types';

/**
 * MoodEngine — a modular, rule-based keyword interpreter.
 * This is NOT AI: it matches user words against keyword dictionaries to
 * infer experiential moods, themes, and intensity. Fully transparent.
 */

type Rule = {
  mood: string;
  themes?: string[];
  keywords: string[];
};

const MOOD_RULES: Rule[] = [
  {
    mood: 'cozy',
    themes: ['comfort', 'home'],
    keywords: ['cozy', 'comfort', 'warm', 'snuggl', 'blanket', 'tea', 'rainy', 'fireplace', 'curl up', 'soft', 'gentle', 'calm', 'relax', 'unwind', 'cosy'],
  },
  {
    mood: 'sad',
    themes: ['grief', 'loss'],
    keywords: ['sad', 'cry', 'tears', 'heartbroken', 'grief', 'loss', 'melancholy', 'lonely', 'loneliness', 'weep', 'sorrow', 'mourn', 'devastat', 'tissue'],
  },
  {
    mood: 'romantic',
    themes: ['love', 'relationships'],
    keywords: ['romantic', 'romance', 'love', 'date', 'partner', 'crush', 'valentine', 'kiss', 'heart', 'soulmate', 'wedding', 'relationship', 'yearn', 'longing'],
  },
  {
    mood: 'adventurous',
    themes: ['adventure', 'discovery'],
    keywords: ['adventure', 'adventurous', 'explore', 'journey', 'quest', 'travel', 'epic', 'voyage', 'trek', 'expedition', 'discovery', 'wander'],
  },
  {
    mood: 'thrilling',
    themes: ['suspense', 'danger'],
    keywords: ['thrill', 'suspense', 'edge', 'edge of my seat', 'tension', 'nail-biting', 'gripping', 'intense', 'danger', 'peril', 'on the edge', 'heart-pounding'],
  },
  {
    mood: 'thoughtful',
    themes: ['reflection', 'meaning'],
    keywords: ['think', 'thoughtful', 'reflect', 'philosoph', 'deep', 'profound', 'contemplat', 'ponder', 'meaning', 'introspect', 'meditat', 'meaningful'],
  },
  {
    mood: 'funny',
    themes: ['comedy', 'joy'],
    keywords: ['funny', 'laugh', 'comedy', 'humor', 'humour', 'hilarious', 'silly', 'light', 'light-hearted', 'lighthearted', 'cheer', 'amusing', 'giggle', 'joke'],
  },
  {
    mood: 'hopeful',
    themes: ['hope', 'inspiration'],
    keywords: ['hope', 'hopeful', 'inspir', 'uplift', 'positive', 'optimistic', 'encourage', 'motivat', 'bright', 'new beginning', 'fresh start', 'renew'],
  },
  {
    mood: 'epic',
    themes: ['scale', 'grandeur'],
    keywords: ['epic', 'grand', 'sweeping', 'massive', 'immersive', 'world-building', 'saga', 'universe', 'vast', 'monumental', 'legendary'],
  },
  {
    mood: 'magical',
    themes: ['wonder', 'fantasy'],
    keywords: ['magic', 'magical', 'fantasy', 'wonder', 'enchant', 'whimsical', 'fairy', 'mythical', 'spell', 'mystical', 'supernatural', 'dreamy'],
  },
  {
    mood: 'dark',
    themes: ['shadow', 'fear'],
    keywords: ['dark', 'grim', 'gritty', 'noir', 'shadow', 'morbid', 'haunt', 'eerie', 'creepy', 'disturb', 'sinister', 'bleak', 'gothic'],
  },
  {
    mood: 'mysterious',
    themes: ['mystery', 'secrets'],
    keywords: ['mystery', 'mysterious', 'puzzle', 'secret', 'enigma', 'twist', 'unknown', 'riddle', 'uncanny', 'cryptic', 'whodunit'],
  },
  {
    mood: 'mind-bending',
    themes: ['complexity', 'perception'],
    keywords: ['mind-bending', 'mindbend', 'complex', 'twist', 'confusing', 'brain', 'intellect', 'puzzle', 'paradox', 'surreal', 'nonlinear', 'layered'],
  },
  {
    mood: 'heartwarming',
    themes: ['kindness', 'connection'],
    keywords: ['heartwarming', 'touching', 'tender', 'sweet', 'wholesome', 'feel-good', 'feel good', 'wholesome', 'kind', 'wholesomeness', 'uplifting'],
  },
  {
    mood: 'emotional',
    themes: ['feeling', 'vulnerability'],
    keywords: ['emotional', 'moved', 'tearjerker', 'stirring', 'poignant', 'moving', 'sentimental', 'vulnerable', 'raw', 'honest'],
  },
  {
    mood: 'adrenaline',
    themes: ['excitement', 'action'],
    keywords: ['adrenaline', 'action', 'fast', 'explos', 'chase', 'fight', 'battle', 'rush', 'wild', 'furious', 'excit', 'thrill-ride'],
  },
  {
    mood: 'relaxing',
    themes: ['peace', 'calm'],
    keywords: ['relax', 'relaxing', 'chill', 'peaceful', 'calm', 'quiet', 'serene', 'tranquil', 'unwind', 'decompress', 'slow', 'easy'],
  },
];

const INTENSITY_KEYWORDS: Record<Intensity, string[]> = {
  intense: ['intense', 'heavy', 'deep', 'devastat', 'overwhelm', 'powerful', 'gripping', 'raw', 'bleak', 'heart-pounding', 'edge of my seat', 'immersive', 'epic', 'dark', 'mind-bending'],
  moderate: ['moderate', 'engaging', 'invested', 'thoughtful', 'suspense', 'emotional', 'adventurous', 'rich', 'layered'],
  light: ['light', 'light-hearted', 'easy', 'cozy', 'comfort', 'gentle', 'relax', 'fun', 'funny', 'whimsical', 'wholesome', 'sweet', 'breezy', 'quick'],
};

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function countMatches(text: string, keywords: string[]): string[] {
  const matched: string[] = [];
  for (const kw of keywords) {
    if (text.includes(kw)) matched.push(kw);
  }
  return matched;
}

export function interpretMood(rawInput: string): MoodInterpretation {
  const text = normalize(rawInput);
  const allKeywords: string[] = [];
  const moodScores: Record<string, number> = {};
  const themeSet = new Set<string>();

  for (const rule of MOOD_RULES) {
    const matched = countMatches(text, rule.keywords);
    if (matched.length > 0) {
      moodScores[rule.mood] = (moodScores[rule.mood] || 0) + matched.length;
      allKeywords.push(...matched);
      if (rule.themes) rule.themes.forEach((t) => themeSet.add(t));
    }
  }

  // Sort moods by score descending
  const sortedMoods = Object.entries(moodScores).sort((a, b) => b[1] - a[1]);
  const primaryMoods = sortedMoods.map(([m]) => m);

  // Intensity detection
  const intensityScores: Record<Intensity, number> = { light: 0, moderate: 0, intense: 0 };
  (Object.keys(intensityScores) as Intensity[]).forEach((level) => {
    intensityScores[level] = countMatches(text, INTENSITY_KEYWORDS[level]).length;
  });

  let intensity: Intensity = 'moderate';
  const intEntries = Object.entries(intensityScores) as [Intensity, number][];
  const best = intEntries.reduce((a, b) => (b[1] > a[1] ? b : a));
  if (best[1] > 0) intensity = best[0];
  else if (primaryMoods.includes('cozy') || primaryMoods.includes('funny') || primaryMoods.includes('relaxing')) {
    intensity = 'light';
  } else if (primaryMoods.includes('dark') || primaryMoods.includes('thrilling') || primaryMoods.includes('sad') || primaryMoods.includes('adrenaline')) {
    intensity = 'intense';
  }

  // Fallback if nothing matched
  if (primaryMoods.length === 0) {
    primaryMoods.push('thoughtful', 'reflective');
    themeSet.add('reflection');
  }

  const toneSummary = buildToneSummary(primaryMoods.slice(0, 3), intensity);

  return {
    primaryMoods,
    detectedThemes: Array.from(themeSet),
    intensity,
    toneSummary,
    keywords: Array.from(new Set(allKeywords)),
  };
}

function buildToneSummary(moods: string[], intensity: Intensity): string {
  const moodPhrase = moods.length > 0 ? moods.join(', ') : 'reflective';
  const intensityLabel =
    intensity === 'light' ? 'light and easy' : intensity === 'intense' ? 'deeply immersive' : 'engaging';
  return `You\u2019re in the mood for something ${moodPhrase} \u2014 ${intensityLabel}.`;
}

/**
 * Score a content record against an interpretation.
 * Returns a numeric score; higher = better match.
 */
export function scoreContent(
  contentMoods: string[],
  interpretation: MoodInterpretation
): number {
  let score = 0;
  for (const cm of contentMoods) {
    const idx = interpretation.primaryMoods.indexOf(cm);
    if (idx >= 0) {
      score += Math.max(1, interpretation.primaryMoods.length - idx);
    }
  }
  // Intensity alignment bonus
  if (contentMoods.includes(interpretation.intensity === 'light' ? 'light' : interpretation.intensity === 'intense' ? 'intense-thrill' : 'adventurous')) {
    score += 0.5;
  }
  return score;
}
