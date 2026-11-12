import React from 'react';
import { Note } from '../types/note';
import { List, Pin, Lock, Trash2 } from 'lucide-react';

interface NoteListProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (note: Note) => void;
  currentViewTitle: string;
}

export const NoteList: React.FC<NoteListProps> = ({ notes, activeNoteId, onSelectNote, currentViewTitle }) => {
  return (
    <aside className="note-list-pane">
      <header className="note-list-header">
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>{currentViewTitle}</h2>
        <div className="search-box">
          <span className="search-icon">
            <List size={14} />
          </span>
          <input type="text" placeholder="Search notes..." disabled />
        </div>
      </header>

      <div className="notes-scroll">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`note-card ${note.id === activeNoteId ? 'active' : ''}`}
            onClick={() => onSelectNote(note)}
          >
            <div className="note-card-title-row">
              <span className="note-card-title">{note.title || <em>Untitled</em>}</span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {note.isPinned && <Pin size={12} color="var(--primary)" />}
                {note.isLocked && <Lock size={12} color="var(--warning)" />}
                {note.isTrash && <Trash2 size={12} color="var(--danger)" />}
              </div>
            </div>
            <div className="note-card-snippet">
              {note.content.slice(0, 120).replace(/\n/g, ' ')}
            </div>
            <div className="note-card-meta">
              <span>{new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
