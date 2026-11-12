import React, { useRef } from 'react';
import {
  Bold,
  CheckSquare,
  Code,
  Download,
  Heading1,
  Heading2,
  Italic,
  List,
  Lock,
  Pin,
  Printer,
  Quote,
  Trash2,
  Unlock,
  Type
} from 'lucide-react';
import { FontFamily, Folder, Note, NoteStats } from '../types/note';
import { exportNoteAsMarkdown, exportNoteAsPlainText, printNote } from '../services/export';
import { calculateNoteStats } from '../services/stats';

interface NoteEditorProps {
  note: Note | null;
  folders: Folder[];
  onUpdateNote: (updated: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  onOpenLockModal: (note: Note) => void;
  isUnlockedTemp?: boolean;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  folders,
  onUpdateNote,
  onDeleteNote,
  onTogglePin,
  onOpenLockModal,
  isUnlockedTemp
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!note) {
    return (
      <div
        className="editor-pane"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-faint)',
          fontSize: '14px'
        }}
      >
        একটি নোট নির্বাচন করুন বা নতুন নোট তৈরি করুন (Select a note or create a new one)
      </div>
    );
  }

  // If locked and not unlocked temporarily in session
  if (note.isLocked && !isUnlockedTemp) {
    return (
      <div
        className="editor-pane"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          color: 'var(--text-muted)'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--warning)'
          }}
        >
          <Lock size={32} />
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>
          এই নোটটি লক করা (Note Locked)
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-faint)', textAlign: 'center', maxWidth: '340px' }}>
          নোটটি দেখার জন্য পাসওয়ার্ড দিয়ে আনলক করুন।
        </p>
        <button
          onClick={() => onOpenLockModal(note)}
          style={{
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Unlock Note (আনলক করুন)
        </button>
      </div>
    );
  }

  const stats: NoteStats = calculateNoteStats(`${note.title}\n${note.content}`);

  // Insert markdown helpers
  const insertSyntax = (before: string, after: string = '') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const val = el.value;
    const selected = val.substring(start, end);
    const replacement = before + selected + after;
    const newContent = val.substring(0, start) + replacement + val.substring(end);

    onUpdateNote({ content: newContent });
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const getFontClass = (family: FontFamily) => {
    switch (family) {
      case 'siliguri':
        return 'font-siliguri';
      case 'inter':
        return 'font-inter';
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      default:
        return 'font-siliguri';
    }
  };

  return (
    <main className="editor-pane">
      {/* Top Action & Formatting Bar */}
      <div className="editor-toolbar">
        {/* Formatting Group */}
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => insertSyntax('**', '**')}
            title="Bold (Ctrl+B)"
          >
            <Bold size={15} />
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => insertSyntax('*', '*')}
            title="Italic (Ctrl+I)"
          >
            <Italic size={15} />
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => insertSyntax('# ')}
            title="Heading 1"
          >
            <Heading1 size={15} />
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => insertSyntax('## ')}
            title="Heading 2"
          >
            <Heading2 size={15} />
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => insertSyntax('- ')}
            title="Bullet List"
          >
            <List size={15} />
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => insertSyntax('- [ ] ')}
            title="To-Do Task"
          >
            <CheckSquare size={15} />
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => insertSyntax('> ')}
            title="Quote"
          >
            <Quote size={15} />
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => insertSyntax('```\n', '\n```')}
            title="Code Block"
          >
            <Code size={15} />
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Notebook / Folder Selector */}
        <div className="toolbar-group">
          <select
            value={note.folderId || ''}
            onChange={(e) => onUpdateNote({ folderId: e.target.value || undefined })}
            style={{
              background: 'var(--bg-input)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '12px'
            }}
          >
            <option value="">No Folder (ফোল্ডার ছাড়া)</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          {/* Font Selector */}
          <select
            value={note.fontFamily || 'siliguri'}
            onChange={(e) => onUpdateNote({ fontFamily: e.target.value as FontFamily })}
            style={{
              background: 'var(--bg-input)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '12px'
            }}
            title="Font Style"
          >
            <option value="siliguri">বাংলা (Hind Siliguri)</option>
            <option value="inter">English (Inter)</option>
            <option value="serif">Serif (Lora)</option>
            <option value="mono">Monospace (Code)</option>
          </select>
        </div>

        {/* Right side Actions: Pin, Lock, Export, Trash */}
        <div className="toolbar-group" style={{ marginLeft: 'auto' }}>
          <button
            type="button"
            className={`toolbar-btn ${note.isPinned ? 'active' : ''}`}
            onClick={() => onTogglePin(note.id)}
            title={note.isPinned ? 'Unpin Note' : 'Pin Note to Top'}
          >
            <Pin size={15} />
          </button>

          <button
            type="button"
            className={`toolbar-btn ${note.isLocked ? 'active' : ''}`}
            onClick={() => onOpenLockModal(note)}
            title={note.isLocked ? 'Unlock or Remove Password' : 'Lock Note with Password'}
          >
            {note.isLocked ? <Unlock size={15} color="var(--warning)" /> : <Lock size={15} />}
          </button>

          <button
            type="button"
            className="toolbar-btn"
            onClick={() => exportNoteAsMarkdown(note)}
            title="Export as Markdown (.md)"
          >
            <Download size={15} />
            <span style={{ fontSize: '11px' }}>MD</span>
          </button>

          <button
            type="button"
            className="toolbar-btn"
            onClick={() => exportNoteAsPlainText(note)}
            title="Export as Plain Text (.txt)"
          >
            <Download size={15} />
            <span style={{ fontSize: '11px' }}>TXT</span>
          </button>

          <button
            type="button"
            className="toolbar-btn"
            onClick={() => printNote(note)}
            title="Print / Save to PDF"
          >
            <Printer size={15} />
          </button>

          <button
            type="button"
            className="toolbar-btn"
            onClick={() => onDeleteNote(note.id)}
            title={note.isTrash ? 'Permanently Delete' : 'Move to Trash'}
            style={{ color: 'var(--danger)' }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className={`editor-body ${getFontClass(note.fontFamily)}`}>
        <input
          type="text"
          className={`note-title-input ${getFontClass(note.fontFamily)}`}
          placeholder="শিরোনাম / Note Title..."
          value={note.title}
          onChange={(e) => onUpdateNote({ title: e.target.value })}
        />

        <textarea
          ref={textareaRef}
          className={`note-content-textarea ${getFontClass(note.fontFamily)}`}
          placeholder="এখানে লিখুন... (Type here in Bangla or English, Markdown supported)"
          value={note.content}
          onChange={(e) => onUpdateNote({ content: e.target.value })}
        />
      </div>

      {/* Bottom Live Metrics & Status Bar */}
      <footer className="editor-footer">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span>{stats.words} শব্দ (words)</span>
          <span>&middot;</span>
          <span>{stats.characters} অক্ষর (chars)</span>
          {stats.banglaCharacters > 0 && (
            <>
              <span>&middot;</span>
              <span>{stats.banglaCharacters} বাংলা অক্ষর</span>
            </>
          )}
          <span>&middot;</span>
          <span>~{stats.readingTimeMinutes} min read</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--success)', fontSize: '11px' }}>✓ Saved locally</span>
        </div>
      </footer>
    </main>
  );
};
