export type FontFamily = 'siliguri' | 'inter' | 'serif' | 'mono';

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId?: string; // optional folder reference
  isPinned: boolean;
  isLocked: boolean;
  isTrash?: boolean;
  tags: string[];
  fontFamily: FontFamily;
  createdAt: number;
  updatedAt: number;
  // encryptedPayload present only when isLocked===true
  encryptedPayload?: {
    ciphertext: string; // Base64
    iv: string; // Base64
    salt: string; // Base64
  };
}

export interface Folder {
  id: string;
  name: string;
  color?: string; // hex color for UI
  createdAt: number;
}

export interface NoteStats {
  words: number;
  characters: number;
  banglaCharacters: number;
  readingTimeMinutes: number;
}
