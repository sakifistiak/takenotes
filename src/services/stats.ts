// src/services/stats.ts
export interface NoteStats {
  words: number;
  characters: number;
  banglaCharacters: number;
  readingTimeMinutes: number;
  lines: number;
}

/** Simple utility to calculate stats for a given markdown/plain text */
export function calculateNoteStats(text: string): NoteStats {
  const trimmed = text.trim();
  const lines = text.split('\n').length;
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const characters = trimmed.length;
  const banglaChars = (trimmed.match(/[\u0980-\u09FF]/g) || []).length;
  // Average reading speed ~200 wpm for English, ~120 wpm for Bangla – we take avg 160 wpm
  const readingTimeMinutes = Math.max(1, Math.round(words / 160));
  return { words, characters, banglaCharacters: banglaChars, readingTimeMinutes, lines };
}
