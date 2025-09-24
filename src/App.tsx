import React, { useEffect, useMemo, useState } from 'react';
import { UploadCsv } from './components/UploadCsv';
import { Controls } from './components/Controls';
import { SearchBar } from './components/SearchBar';
import { DataTable } from './components/DataTable';
import { parseBooksCsv } from './utils/csv';
import { generateFakeBooks } from './utils/fake';
import { BookRow, ColumnKey, EditTracker, SortState } from './types';

export function App() {
  const [rows, setRows] = useState<BookRow[]>([]);
  const [originalRows, setOriginalRows] = useState<BookRow[]>([]);
  const [edits, setEdits] = useState<EditTracker>({});
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortState>({ key: null, direction: 'asc' });
  const [pageSize] = useState(200);
  const [page, setPage] = useState(0);

  function applyEdits(base: BookRow[], currentEdits: EditTracker): BookRow[] {
    if (!currentEdits || Object.keys(currentEdits).length === 0) return base;
    return base.map((r) => {
      const e = currentEdits[r.__rowId];
      if (!e) return r;
      const updated: BookRow = { ...r };
      (Object.keys(e) as ColumnKey[]).forEach((k) => {
        const v = e[k];
        if (v !== undefined) {
          if (k === 'PublishedYear') {
            updated[k] = Number(v) as never;
          } else {
            updated[k] = v as never;
          }
        }
      });
      return updated;
    });
  }

  const effectiveRows = useMemo(() => applyEdits(rows, edits), [rows, edits]);

  async function handleFile(file: File) {
    setIsLoading(true);
    try {
      const parsed = await parseBooksCsv(file);
      setRows(parsed);
      setOriginalRows(parsed);
      setEdits({});
      setPage(0);
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit(rowId: string, key: ColumnKey, value: string) {
    setEdits((prev) => {
      const rowEdits = prev[rowId] ? { ...prev[rowId] } : {};
      rowEdits[key] = value;
      return { ...prev, [rowId]: rowEdits };
    });
  }

  function handleReset() {
    setEdits({});
    setRows(originalRows);
    setPage(0);
  }

  function handleGenerateFake() {
    setIsLoading(true);
    setTimeout(() => {
      const fake = generateFakeBooks(10000);
      setRows(fake);
      setOriginalRows(fake);
      setEdits({});
      setPage(0);
      setIsLoading(false);
    }, 10);
  }

  useEffect(() => {
    if (rows.length === 0 && originalRows.length === 0) {
      // lazy generate a small initial set to show UI (optional)
    }
  }, [rows, originalRows]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-xl font-bold text-gray-800">📚 Book CSV Manager</h1>
            {effectiveRows.length > 0 && (
              <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                {effectiveRows.length.toLocaleString()} books
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <UploadCsv onFile={handleFile} isLoading={isLoading} />
            <Controls rows={effectiveRows} onReset={handleReset} onGenerateFake={handleGenerateFake} hasData={effectiveRows.length > 0} />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
          <SearchBar value={search} onChange={setSearch} />
          {isLoading && (
            <div className="flex items-center text-sm text-primary-700 bg-primary-50 px-3 py-2 rounded-lg" role="status">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Loading…
            </div>
          )}
        </div>

        {effectiveRows.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Data Loaded</h2>
            <p className="text-gray-500 mb-6">Upload a CSV file or generate sample data to get started</p>
            <div className="flex justify-center gap-3">
              <UploadCsv onFile={handleFile} isLoading={isLoading} />
              <button
                className="px-4 py-2 border border-primary-300 rounded-lg text-sm font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 hover:border-primary-400 transition-colors duration-200 shadow-sm"
                onClick={handleGenerateFake}
              >
                🎲 Generate Sample Data
              </button>
            </div>
          </div>
        ) : (
          <DataTable
            rows={effectiveRows}
            edits={edits}
            onEdit={handleEdit}
            sort={sort}
            setSort={setSort}
            search={search}
            pageSize={pageSize}
            page={page}
            setPage={setPage}
          />
        )}
      </main>

      <footer className="py-3 sm:py-4 border-t border-gray-200 bg-white text-xs text-center text-gray-500">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          CSV parsing by PapaParse • Virtualized by react-window • Styled with Tailwind CSS
        </div>
      </footer>
    </div>
  );
}
