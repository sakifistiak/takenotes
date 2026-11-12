// src/services/export.ts
// Simple export utilities for TakeNotes – Markdown, plain text, and printing.

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
