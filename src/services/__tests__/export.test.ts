import { describe, expect, it } from 'vitest';
import { parseWorkspaceBackup } from '../export';
import { Folder, Note } from '../../types/note';

describe('parseWorkspaceBackup', () => {
  it('parses valid backup json', () => {
    const sample = JSON.stringify({
      version: 1,
      exportedAt: new Date().toISOString(),
      folders: [{ id: 'f1', name: 'Work', createdAt: 123 }] as Folder[],
      notes: [{ id: 'n1', title: 'Test', content: 'Body', isPinned: false, isLocked: false, tags: [], fontFamily: 'siliguri', createdAt: 123, updatedAt: 123 }] as Note[]
    });

    const parsed = parseWorkspaceBackup(sample);
    expect(parsed.folders.length).toBe(1);
    expect(parsed.notes.length).toBe(1);
    expect(parsed.notes[0]?.title).toBe('Test');
  });

  it('throws on invalid json structure', () => {
    expect(() => parseWorkspaceBackup('{}')).toThrow();
    expect(() => parseWorkspaceBackup('{"notes": "invalid"}')).toThrow();
  });
});
