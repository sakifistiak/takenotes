// src/services/export.ts
// Export utilities for TakeNotes: Markdown, plain text, printing, and workspace backup.

/** Export a note as a Markdown file */
export function exportNoteAsMarkdown(note: { title: string; content: string }) {
  const md = `# ${note.title}\n\n${note.content}`;
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${note.title || 'note'}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Export a note as a plain‑text file */
export function exportNoteAsPlainText(note: { title: string; content: string }) {
  const txt = `${note.title}\n\n${note.content}`;
  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${note.title || 'note'}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Print a note in a new window */
export function printNote(note: { title: string; content: string }) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  const html = `<!doctype html><html><head><title>${note.title}</title><style>
    body { font-family: system-ui, sans-serif; padding: 2rem; line-height: 1.6; }
    pre { white-space: pre-wrap; word-wrap: break-word; }
  </style></head><body>
    <h1>${note.title}</h1>
    <pre>${note.content}</pre>
  </body></html>`;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 300);
}

/** Export the entire workspace (folders & notes) as a downloadable JSON file */
export function exportWorkspaceBackup(folders: any[], notes: any[]): Blob {
  const data = JSON.stringify({ folders, notes }, null, 2);
  const blob = new Blob([data], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'takenotes-backup.json';
  a.click();
  URL.revokeObjectURL(url);
  return blob;
}

/** Overloads for parsing a workspace backup */
export function parseWorkspaceBackup(input: string): { folders: any[]; notes: any[] };
export function parseWorkspaceBackup(input: Blob): Promise<{ folders: any[]; notes: any[] }>;
export function parseWorkspaceBackup(input: any): any {
  if (typeof input === 'string') {
    const parsed = JSON.parse(input);
    if (!Array.isArray(parsed.folders) || !Array.isArray(parsed.notes)) {
      throw new Error('Invalid backup structure');
    }
    return { folders: parsed.folders, notes: parsed.notes };
  }
  // Assume Blob
  return (async () => {
    const text = await input.text();
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed.folders) || !Array.isArray(parsed.notes)) {
      throw new Error('Invalid backup structure');
    }
    return { folders: parsed.folders, notes: parsed.notes };
  })();
}
