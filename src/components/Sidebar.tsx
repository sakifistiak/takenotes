import React from 'react';
import {
  BookOpen,
  FolderPlus,
  Heart,
  Plus,
  Trash2,
  UploadCloud,
  Folder as FolderIcon
} from 'lucide-react';
import { Folder } from '../types/note';

interface SidebarProps {
  currentView: 'all' | 'favorites' | 'trash' | string;
  onSelectView: (view: 'all' | 'favorites' | 'trash' | string) => void;
  folders: Folder[];
  onOpenNewFolderModal: () => void;
  onOpenBackupModal: () => void;
  onNewNote: () => void;
  totalNotesCount: number;
  favNotesCount: number;
  trashNotesCount: number;
  getFolderNotesCount: (folderId: string) => number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  folders,
  onOpenNewFolderModal,
  onOpenBackupModal,
  onNewNote,
  totalNotesCount,
  favNotesCount,
  trashNotesCount,
  getFolderNotesCount
}) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-badge">
          <div className="brand-icon">
            <BookOpen size={18} />
          </div>
          <span>TakeNotes</span>
        </div>
      </div>

      <div style={{ padding: '16px 12px 4px 12px' }}>
        <button
          onClick={onNewNote}
          style={{
            width: '100%',
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 14px',
            fontWeight: 600,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
          }}
        >
          <Plus size={16} />
          <span>New Note / নতুন নোট</span>
        </button>
      </div>

      <nav className="sidebar-nav">
        <div>
          <div className="nav-section-title">
            <span>Views / ভিউ</span>
          </div>

          <div
            className={`nav-item ${currentView === 'all' ? 'active' : ''}`}
            onClick={() => onSelectView('all')}
          >
            <BookOpen size={16} />
            <span>All Notes (সব নোট)</span>
            <span className="nav-badge">{totalNotesCount}</span>
          </div>

          <div
            className={`nav-item ${currentView === 'favorites' ? 'active' : ''}`}
            onClick={() => onSelectView('favorites')}
          >
            <Heart size={16} />
            <span>Pinned (পিন করা)</span>
            <span className="nav-badge">{favNotesCount}</span>
          </div>

          <div
            className={`nav-item ${currentView === 'trash' ? 'active' : ''}`}
            onClick={() => onSelectView('trash')}
          >
            <Trash2 size={16} />
            <span>Trash (রিসাইকেল বিন)</span>
            <span className="nav-badge">{trashNotesCount}</span>
          </div>
        </div>

        <div>
          <div className="nav-section-title">
            <span>Notebooks / ফোল্ডার</span>
            <button
              onClick={onOpenNewFolderModal}
              title="Create new folder"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-faint)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <FolderPlus size={15} />
            </button>
          </div>

          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`nav-item ${currentView === folder.id ? 'active' : ''}`}
              onClick={() => onSelectView(folder.id)}
            >
              <FolderIcon size={16} color={folder.color || 'var(--primary)'} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {folder.name}
              </span>
              <span className="nav-badge">{getFolderNotesCount(folder.id)}</span>
            </div>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <button
          onClick={onOpenBackupModal}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px'
          }}
        >
          <UploadCloud size={14} />
          <span>Backup / Restore</span>
        </button>
        <span style={{ fontSize: '10px', color: 'var(--success)' }}>● Offline Ready</span>
      </div>
    </aside>
  );
};
