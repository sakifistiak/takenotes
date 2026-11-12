import React, { useEffect, useMemo, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';
import { NoteLockModal } from './components/Modals/NoteLockModal';
import { BackupModal } from './components/Modals/BackupModal';
import { NewFolderModal } from './components/Modals/NewFolderModal';
import { Folder, Note } from './types/note';
import {
  deleteFolderFromStorage,
  deleteNoteFromStorage,
  getAllFolders,
  getAllNotes,
  INITIAL_FOLDERS,
  INITIAL_WELCOME_NOTE,
  saveFolderToStorage,
  saveNoteToStorage
} from './services';

export const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'all' | 'favorites' | 'trash' | string>('all');
  const [loaded, setLoaded] = useState(false);

  // Modals state
  const [lockModalNote, setLockModalNote] = useState<Note | null>(null);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);

  // Load initial data from IndexedDB
  useEffect(() => {
    async function initData() {
      let loadedNotes = await getAllNotes();
      let loadedFolders = await getAllFolders();

      if (loadedNotes.length === 0) {
        await saveNoteToStorage(INITIAL_WELCOME_NOTE);
        loadedNotes = [INITIAL_WELCOME_NOTE];
      }

      if (loadedFolders.length === 0) {
        for (const f of INITIAL_FOLDERS) {
          await saveFolderToStorage(f);
        }
        loadedFolders = INITIAL_FOLDERS;
      }

      setNotes(loadedNotes);
      setFolders(loadedFolders);
      setActiveNoteId(loadedNotes[0]?.id ?? null);
      setLoaded(true);
    }
    initData();
  }, []);

  // Global Keyboard shortcuts (e.g. Ctrl+N)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleCreateNote();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [folders, currentView]);

  const activeNote = useMemo(() => {
    return notes.find((n) => n.id === activeNoteId) || null;
  }, [notes, activeNoteId]);

  // Filter notes based on current view
  const visibleNotes = useMemo(() => {
    if (currentView === 'trash') {
      return notes.filter((n) => n.isTrash);
    }

    // Normal non-trash notes
    const active = notes.filter((n) => !n.isTrash);

    if (currentView === 'favorites') {
      return active.filter((n) => n.isPinned);
    }

    if (currentView !== 'all') {
      return active.filter((n) => n.folderId === currentView);
    }

    // 'all' view: pinned notes first, then sorted by updatedAt
    return [...active].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return b.updatedAt - a.updatedAt;
    });
  }, [notes, currentView]);

  const currentViewTitle = useMemo(() => {
    if (currentView === 'all') return 'All Notes (সব নোট)';
    if (currentView === 'favorites') return 'Pinned Notes (পিন করা নোট)';
    if (currentView === 'trash') return 'Trash (রিসাইকেল বিন)';
    const folder = folders.find((f) => f.id === currentView);
    return folder ? folder.name : 'Notes';
  }, [currentView, folders]);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: 'note-' + Date.now(),
      title: '',
      content: '',
      folderId: currentView !== 'all' && currentView !== 'favorites' && currentView !== 'trash' ? currentView : undefined,
      isPinned: false,
      isLocked: false,
      tags: [],
      fontFamily: 'siliguri',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    saveNoteToStorage(newNote);
  };

  const handleUpdateNote = (updatedFields: Partial<Note>) => {
    if (!activeNoteId) return;

    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== activeNoteId) return n;
        const updated = {
          ...n,
          ...updatedFields,
          updatedAt: Date.now()
        };
        saveNoteToStorage(updated);
        return updated;
      })
    );
  };

  const handleDeleteNote = (id: string) => {
    const target = notes.find((n) => n.id === id);
    if (!target) return;

    if (target.isTrash) {
      // Permanent delete
      setNotes((prev) => prev.filter((n) => n.id !== id));
      deleteNoteFromStorage(id);
      if (activeNoteId === id) {
        const remaining = visibleNotes.filter((n) => n.id !== id);
        setActiveNoteId(remaining[0]?.id ?? null);
      }
    } else {
      // Soft delete to trash
      handleUpdateNote({ isTrash: true });
    }
  };

  const handleTogglePin = (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const nextPinned = !note.isPinned;
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const updated = { ...n, isPinned: nextPinned, updatedAt: Date.now() };
          saveNoteToStorage(updated);
          return updated;
        }
        return n;
      })
    );
  };

  const handleCreateFolder = async (folder: Folder) => {
    setFolders((prev) => [...prev, folder]);
    await saveFolderToStorage(folder);
    setCurrentView(folder.id);
  };

  const handleRestoreBackup = async (restoredFolders: Folder[], restoredNotes: Note[]) => {
    setFolders(restoredFolders);
    setNotes(restoredNotes);
    for (const f of restoredFolders) {
      await saveFolderToStorage(f);
    }
    for (const n of restoredNotes) {
      await saveNoteToStorage(n);
    }
    setActiveNoteId(restoredNotes[0]?.id ?? null);
  };

  if (!loaded) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-main)',
          color: 'var(--text-muted)'
        }}
      >
        Loading TakeNotes...
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        folders={folders}
        onOpenNewFolderModal={() => setShowFolderModal(true)}
        onOpenBackupModal={() => setShowBackupModal(true)}
        onNewNote={handleCreateNote}
        totalNotesCount={notes.filter((n) => !n.isTrash).length}
        favNotesCount={notes.filter((n) => !n.isTrash && n.isPinned).length}
        trashNotesCount={notes.filter((n) => n.isTrash).length}
        getFolderNotesCount={(folderId) =>
          notes.filter((n) => !n.isTrash && n.folderId === folderId).length
        }
      />

      <NoteList
        notes={visibleNotes}
        activeNoteId={activeNoteId}
        onSelectNote={(note) => setActiveNoteId(note.id)}
        currentViewTitle={currentViewTitle}
      />

      <NoteEditor
        note={activeNote}
        folders={folders}
        onUpdateNote={handleUpdateNote}
        onDeleteNote={handleDeleteNote}
        onTogglePin={handleTogglePin}
        onOpenLockModal={(note) => setLockModalNote(note)}
      />

      {lockModalNote && (
        <NoteLockModal
          note={lockModalNote}
          onClose={() => setLockModalNote(null)}
          onSuccess={(updated) => handleUpdateNote(updated)}
        />
      )}

      {showFolderModal && (
        <NewFolderModal
          onClose={() => setShowFolderModal(false)}
          onCreateFolder={handleCreateFolder}
        />
      )}

      {showBackupModal && (
        <BackupModal
          folders={folders}
          notes={notes}
          onClose={() => setShowBackupModal(false)}
          onRestore={handleRestoreBackup}
        />
      )}
    </div>
  );
};
