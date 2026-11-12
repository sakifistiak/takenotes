import { Note, Folder, INITIAL_FOLDERS, INITIAL_WELCOME_NOTE } from '../types/note';
import { getAllNotes as getAllNotesFromDB, getAllFolders as getAllFoldersFromDB, saveNoteToStorage as saveNoteDB, saveFolderToStorage as saveFolderDB, deleteNoteFromStorage as deleteNoteDB, deleteFolderFromStorage as deleteFolderDB } from './storage';

// Re-export the initialization constants for use in App
export { INITIAL_FOLDERS, INITIAL_WELCOME_NOTE } from '../types/note';

export async function getAllNotes(): Promise<Note[]> {
  return await getAllNotesFromDB();
}

export async function getAllFolders(): Promise<Folder[]> {
  return await getAllFoldersFromDB();
}

export async function saveNoteToStorage(note: Note): Promise<void> {
  await saveNoteDB(note);
}

export async function saveFolderToStorage(folder: Folder): Promise<void> {
  await saveFolderDB(folder);
}

export async function deleteNoteFromStorage(id: string): Promise<void> {
  await deleteNoteDB(id);
}

export async function deleteFolderFromStorage(id: string): Promise<void> {
  await deleteFolderDB(id);
}
