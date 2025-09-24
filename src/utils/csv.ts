import Papa from 'papaparse';
import { Book, BookRow } from '../types';
import type { ParseResult } from 'papaparse';

export function parseBooksCsv(file: File): Promise<BookRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Book>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim(),
      dynamicTyping: { PublishedYear: true },
      complete: (results: ParseResult<Book>) => {
        const data = (results.data || []).filter(Boolean);
        const rows: BookRow[] = data.map((d: Book, idx: number) => ({
          Title: String(d.Title ?? ''),
          Author: String(d.Author ?? ''),
          Genre: String(d.Genre ?? ''),
          PublishedYear: Number(d.PublishedYear ?? 0),
          ISBN: String(d.ISBN ?? ''),
          __rowId: `r_${idx}_${Math.random().toString(36).slice(2, 8)}`,
        }));
        resolve(rows);
      },
      error: (error: Error) => reject(error),
    });
  });
}

export function downloadBooksCsv(rows: BookRow[], filename: string) {
  const clean: Book[] = rows.map(({ __rowId, ...rest }) => rest);
  const csv = Papa.unparse(clean, { quotes: false, header: true });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


