// Case conversion utilities
export function toUpperCase(text: string): string {
  return text.toUpperCase();
}

export function toLowerCase(text: string): string {
  return text.toLowerCase();
}

export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Word and character counting
export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
}

export function countText(text: string): TextStats {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const lines = text === '' ? 0 : text.split('\n').length;
  const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim() !== '').length;

  return {
    characters,
    charactersNoSpaces,
    words,
    lines,
    paragraphs,
  };
}

// Remove duplicate lines (preserving first occurrence order)
export function removeDuplicateLines(text: string): string {
  const lines = text.split('\n');
  const seen = new Set<string>();
  const uniqueLines: string[] = [];

  for (const line of lines) {
    if (!seen.has(line)) {
      seen.add(line);
      uniqueLines.push(line);
    }
  }

  return uniqueLines.join('\n');
}

// Text sorting
export function sortLinesAZ(text: string): string {
  const lines = text.split('\n');
  return lines.sort((a, b) => a.localeCompare(b)).join('\n');
}

export function sortLinesZA(text: string): string {
  const lines = text.split('\n');
  return lines.sort((a, b) => b.localeCompare(a)).join('\n');
}

// Line breaker / paragraph formatter
export function formatParagraphs(text: string): string {
  // Normalize line breaks: convert multiple blank lines to double line breaks
  // and single line breaks within paragraphs to spaces
  return text
    .split(/\n\s*\n/)
    .map(paragraph => paragraph.replace(/\n/g, ' ').trim())
    .filter(p => p !== '')
    .join('\n\n');
}

// Slug / URL generator
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Lorem ipsum generator
const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum',
];

function getRandomWord(): string {
  return loremWords[Math.floor(Math.random() * loremWords.length)];
}

function generateSentence(minWords: number = 8, maxWords: number = 16): string {
  const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const words: string[] = [];
  
  for (let i = 0; i < wordCount; i++) {
    words.push(getRandomWord());
  }
  
  // Capitalize first word
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  
  return words.join(' ') + '.';
}

export function generateLoremIpsum(paragraphs: number = 3): string {
  const result: string[] = [];
  
  for (let i = 0; i < paragraphs; i++) {
    const sentenceCount = Math.floor(Math.random() * 3) + 3; // 3-5 sentences per paragraph
    const sentences: string[] = [];
    
    for (let j = 0; j < sentenceCount; j++) {
      sentences.push(generateSentence());
    }
    
    result.push(sentences.join(' '));
  }
  
  return result.join('\n\n');
}

// Hashtag generator
export function generateHashtags(text: string): string[] {
  // Split by spaces and punctuation, filter out empty strings
  const words = text
    .toLowerCase()
    .split(/[\s,.\-!?;:()[\]{}'"]+/)
    .filter(word => word.length > 0);
  
  // Remove duplicates and create hashtags
  const uniqueWords = Array.from(new Set(words));
  
  // Generate hashtags from individual words
  const hashtags = uniqueWords.map(word => `#${word}`);
  
  // Also try to create compound hashtags from consecutive words
  const phrases = text
    .toLowerCase()
    .split(/[,.\-!?;:()[\]{}'"]+/)
    .map(phrase => phrase.trim())
    .filter(phrase => phrase.length > 0);
  
  for (const phrase of phrases) {
    const phraseWords = phrase.split(/\s+/).filter(w => w.length > 0);
    if (phraseWords.length >= 2 && phraseWords.length <= 4) {
      const compoundHashtag = '#' + phraseWords
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join('');
      if (!hashtags.includes(compoundHashtag)) {
        hashtags.push(compoundHashtag);
      }
    }
  }
  
  return hashtags;
}
