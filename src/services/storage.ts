// src/services/storage.ts
// Simple IndexedDB based storage for notes and folders (fallback to localStorage)
import { Note, Folder } from '../types/note';

const DB_NAME = 'takenotes_db';
const DB_VERSION = 1;
const NOTE_STORE = 'notes';
const FOLDER_STORE = 'folders';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(NOTE_STORE)) {
        db.createObjectStore(NOTE_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(FOLDER_STORE)) {
        db.createObjectStore(FOLDER_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ---------- Notes ----------
export async function getAllNotes(): Promise<Note[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(NOTE_STORE, 'readonly');
      const store = tx.objectStore(NOTE_STORE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as Note[]);
      req.onerror = () => reject(req.error);
    });
  } catch {
    const raw = localStorage.getItem('takenotes_notes');
    return raw ? JSON.parse(raw) : [];
  }
}

export async function saveNoteToStorage(note: Note): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(NOTE_STORE, 'readwrite');
      const store = tx.objectStore(NOTE_STORE);
      const req = store.put(note);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const notes = await getAllNotes();
    const idx = notes.findIndex((n) => n.id === note.id);
    if (idx >= 0) notes[idx] = note; else notes.push(note);
    localStorage.setItem('takenotes_notes', JSON.stringify(notes));
  }
}

export async function deleteNoteFromStorage(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(NOTE_STORE, 'readwrite');
      const store = tx.objectStore(NOTE_STORE);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const notes = (await getAllNotes()).filter((n) => n.id !== id);
    localStorage.setItem('takenotes_notes', JSON.stringify(notes));
  }
}

// ---------- Folders ----------
export async function getAllFolders(): Promise<Folder[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(FOLDER_STORE, 'readonly');
      const store = tx.objectStore(FOLDER_STORE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as Folder[]);
      req.onerror = () => reject(req.error);
    });
  } catch {
    const raw = localStorage.getItem('takenotes_folders');
    return raw ? JSON.parse(raw) : [];
  }
}

export async function saveFolderToStorage(folder: Folder): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(FOLDER_STORE, 'readwrite');
      const store = tx.objectStore(FOLDER_STORE);
      const req = store.put(folder);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const folders = await getAllFolders();
    const idx = folders.findIndex((f) => f.id === folder.id);
    if (idx >= 0) folders[idx] = folder; else folders.push(folder);
    localStorage.setItem('takenotes_folders', JSON.stringify(folders));
  }
}

export async function deleteFolderFromStorage(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(FOLDER_STORE, 'readwrite');
      const store = tx.objectStore(FOLDER_STORE);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const folders = (await getAllFolders()).filter((f) => f.id !== id);
    localStorage.setItem('takenotes_folders', JSON.stringify(folders));
  }
}
