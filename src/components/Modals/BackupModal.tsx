import React, { useRef, useState } from 'react';
import { Download, Upload, X } from 'lucide-react';
import { Folder, Note } from '../../types/note';
import { exportWorkspaceBackup, parseWorkspaceBackup } from '../../services/export';

interface BackupModalProps {
  folders: Folder[];
  notes: Note[];
  onClose: () => void;
  onRestore: (folders: Folder[], notes: Note[]) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  folders,
  notes,
  onClose,
  onRestore
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = () => {
    exportWorkspaceBackup(folders, notes);
    setStatusMsg({ type: 'success', text: 'সব নোট সফলভাবে ডাউনলোড হয়েছে (Backup downloaded).' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const backup = parseWorkspaceBackup(text);
        onRestore(backup.folders, backup.notes);
        setStatusMsg({ type: 'success', text: 'ব্যাকআপ সফলভাবে রিস্টোর হয়েছে (Backup restored successfully)!' });
        setTimeout(() => onClose(), 1200);
      } catch (err) {
        setStatusMsg({ type: 'error', text: 'অকার্যকর ব্যাকআপ ফাইল (Invalid backup file).' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Backup & Restore / ব্যাকআপ</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {statusMsg && (
          <div
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              background: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'var(--danger-light)',
              color: statusMsg.type === 'success' ? 'var(--success)' : 'var(--danger)',
              fontSize: '12px',
              marginBottom: '16px'
            }}
          >
            {statusMsg.text}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              padding: '16px',
              background: 'var(--bg-sidebar)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <h4 style={{ fontSize: '13px', fontWeight: 600 }}>Download JSON Backup (ব্যাকআপ ডাউনলোড)</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-faint)' }}>
              আপনার সব ফোল্ডার এবং নোট ব্রাউজার থেকে একটি ফাইলে সেভ করে রাখুন।
            </p>
            <button
              onClick={handleExport}
              style={{
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                width: 'fit-content',
                cursor: 'pointer',
                marginTop: '4px'
              }}
            >
              <Download size={14} />
              <span>Export All Notes (.json)</span>
            </button>
          </div>

          <div
            style={{
              padding: '16px',
              background: 'var(--bg-sidebar)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <h4 style={{ fontSize: '13px', fontWeight: 600 }}>Restore from Backup (ব্যাকআপ রিস্টোর)</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-faint)' }}>
              পূর্বে ডাউনলোড করা কোনো JSON ব্যাকআপ ফাইল সিলেক্ট করে সব নোট ফেরত আনুন।
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                width: 'fit-content',
                cursor: 'pointer',
                marginTop: '4px'
              }}
            >
              <Upload size={14} />
              <span>Upload Backup File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
