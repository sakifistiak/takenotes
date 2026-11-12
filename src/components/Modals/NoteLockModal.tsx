import React, { useState } from 'react';
import { Lock, Unlock, X } from 'lucide-react';
import { Note } from '../../types/note';
import { decryptText, encryptText } from '../../services/crypto';

interface NoteLockModalProps {
  note: Note;
  onClose: () => void;
  onSuccess: (updated: Partial<Note>) => void;
}

export const NoteLockModal: React.FC<NoteLockModalProps> = ({ note, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password) {
      setError('পাসওয়ার্ড দিন (Password is required)');
      return;
    }
    if (password !== confirmPassword) {
      setError('উভয় পাসওয়ার্ড একই হতে হবে (Passwords do not match)');
      return;
    }

    try {
      setLoading(true);
      const payload = await encryptText(note.content, password);
      onSuccess({
        isLocked: true,
        encryptedPayload: payload,
        content: '' // Clear plaintext from storage
      });
      onClose();
    } catch (err) {
      setError('লক করতে সমস্যা হয়েছে (Encryption failed)');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!note.encryptedPayload) {
      setError('লক ডেটা পাওয়া যায়নি');
      return;
    }

    try {
      setLoading(true);
      const decrypted = await decryptText(note.encryptedPayload, password);
      // Success unlock: remove lock and restore content
      onSuccess({
        isLocked: false,
        encryptedPayload: undefined,
        content: decrypted
      });
      onClose();
    } catch {
      setError('ভুল পাসওয়ার্ড! আবার চেষ্টা করুন (Incorrect password)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {note.isLocked ? <Unlock size={20} color="var(--warning)" /> : <Lock size={20} color="var(--primary)" />}
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
              {note.isLocked ? 'নোট আনলক করুন (Unlock Note)' : 'পাসওয়ার্ড দিয়ে নোট লক করুন (Lock Note)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              background: 'var(--danger-light)',
              color: 'var(--danger)',
              fontSize: '12px',
              marginBottom: '14px'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={note.isLocked ? handleUnlock : handleLock} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              পাসওয়ার্ড (Password):
            </label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--text-main)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {!note.isLocked && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                পাসওয়ার্ড নিশ্চিত করুন (Confirm Password):
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'var(--text-main)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                borderRadius: '6px',
                padding: '8px 14px',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: note.isLocked ? 'var(--warning)' : 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {loading ? 'Processing...' : note.isLocked ? 'Unlock Note' : 'Lock Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
