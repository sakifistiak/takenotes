export const INITIAL_FOLDERS: Folder[] = [
  { id: 'f-personal', name: 'ব্যক্তিগত / Personal', color: '#6366f1', createdAt: Date.now() },
  { id: 'f-work', name: 'কাজ / Work', color: '#10b981', createdAt: Date.now() },
  { id: 'f-ideas', name: 'আইডিয়া / Ideas', color: '#f59e0b', createdAt: Date.now() }
];

export const INITIAL_WELCOME_NOTE: Note = {
  id: 'welcome-note-1',
  title: 'Welcome to TakeNotes / স্বাগতম!',
  content: `# TakeNotes — আপনার ডিজিটাল নোটবুক 📓\n\nTakeNotes হলো একটি অত্যন্ত দ্রুত, প্রাইভেট এবং ব্রাউজার-বেসড নোটবুক যা সম্পূর্ণভাবে **অফলাইনে** কাজ করে।\n\n## বিশেষ সুবিধাসমূহ (Key Features):\n- **দ্বিভাষিক টাইপোগ্রাফি (Bilingual Support):** বাংলা ও ইংরেজির জন্য আধুনিক ফন্ট (Hind Siliguri, Inter, JetBrains Mono)।\n- **স্মার্ট অটো-সেভ:** প্রতিটা ক্যারেক্টার লেখার সাথে সাথেই ব্রাউজারে স্বয়ংক্রিয়ভাবে সেভ হয়।\n- **নোট লক (Privacy Lock):** যে কোনো সংবেদনশীল নোট পাসওয়ার্ড দিয়ে AES-256 এনক্রিপ্ট করে লক করা যায়।\n- **Markdown & Shortcuts:** হেডিং, লিস্ট, চেকলিস্ট, কোড ব্লক এবং টেবিল তৈরি করার সহজ শর্টকাট।\n- **অফলাইন ও PWA:** ইন্টারনেট ছাড়াই যে কোনো সময় ব্যবহার করুন এবং অ্যাপ হিসেবে ইনস্টল করুন।\n\n> "লিখুন সহজে, ভাবুন মুক্তভাবে।"\n\n### টাস্ক লিস্ট (Try it out):\n- [x] TakeNotes ওপেন করা হয়েছে\n- [ ] একটি নতুন নোট তৈরি করুন (+ New Note)\n- [ ] বাংলা ও ইংরেজিতে একসাথে কিছু লিখুন\n- [ ] একটি নোট পাসওয়ার্ড দিয়ে লক করে দেখুন 🔒\n`,
  isPinned: true,
  isLocked: false,
  tags: ['Welcome', 'Guide'],
  fontFamily: 'siliguri',
  createdAt: Date.now(),
  updatedAt: Date.now()
};

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
  lines?: number;
}
