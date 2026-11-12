import { describe, expect, it } from 'vitest';
import { calculateNoteStats } from '../stats';

describe('calculateNoteStats', () => {
  it('calculates stats for mixed Bangla and English text', () => {
    const text = 'আমার সোনার বাংলা\nI love my country.';
    const stats = calculateNoteStats(text);

    expect(stats.lines).toBe(2);
    expect(stats.words).toBe(7);
    expect(stats.banglaCharacters).toBeGreaterThan(10);
    expect(stats.characters).toBe(text.length);
    expect(stats.readingTimeMinutes).toBe(1);
  });

  it('handles empty text gracefully', () => {
    const stats = calculateNoteStats('');
    expect(stats.words).toBe(0);
    expect(stats.characters).toBe(0);
    expect(stats.banglaCharacters).toBe(0);
    expect(stats.lines).toBe(0);
  });
});
