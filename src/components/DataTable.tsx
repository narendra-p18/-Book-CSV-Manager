import React, { useMemo, useState } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { BookRow, ColumnKey, EditTracker, SortState } from '../types';
import clsx from 'clsx';

const columns: { key: ColumnKey; label: string; width: number }[] = [
  { key: 'Title', label: 'Title', width: 320 },
  { key: 'Author', label: 'Author', width: 220 },
  { key: 'Genre', label: 'Genre', width: 160 },
  { key: 'PublishedYear', label: 'Published Year', width: 150 },
  { key: 'ISBN', label: 'ISBN', width: 220 },
];

type Props = {
  rows: BookRow[];
  edits: EditTracker;
  onEdit: (rowId: string, key: ColumnKey, value: string) => void;
  sort: SortState;
  setSort: (s: SortState) => void;
  search: string;
  pageSize: number;
  page: number;
  setPage: (p: number) => void;
};

export function DataTable(props: Props) {
  const { rows, edits, onEdit, sort, setSort, search, pageSize, page, setPage } = props;

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) =>
      r.Title.toLowerCase().includes(q) ||
      r.Author.toLowerCase().includes(q) ||
      r.Genre.toLowerCase().includes(q) ||
      String(r.PublishedYear).toLowerCase().includes(q) ||
      r.ISBN.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const sorted = useMemo(() => {
    if (!sort.key) return filtered;
    const k = sort.key;
    const direction = sort.direction === 'asc' ? 1 : -1;
    const copy = filtered.slice();
    copy.sort((a, b) => {
      const va = a[k];
      const vb = b[k];
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * direction;
      return String(va).localeCompare(String(vb)) * direction;
    });
    return copy;
  }, [filtered, sort]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const paged = useMemo(() => {
    const start = currentPage * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  function toggleSort(key: ColumnKey) {
    if (sort.key !== key) {
      setSort({ key, direction: 'asc' });
    } else {
      setSort({ key, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
    }
  }

  function RowRenderer({ index, style }: ListChildComponentProps) {
    const r = paged[index];
    const rowEdits = edits[r.__rowId] || {};
    const isRowEdited = Object.keys(rowEdits).length > 0;
    return (
      <div style={style} className={clsx('flex border-b border-gray-200 text-xs hover:bg-gray-50 transition-colors duration-150', isRowEdited && 'bg-blue-50')}> 
        {columns.map((col) => {
          const original = String(r[col.key] ?? '');
          const val = rowEdits[col.key] ?? original;
          const changed = val !== original;
          return (
            <div key={col.key} className={clsx('p-3 border-r border-gray-200', changed && 'bg-yellow-100')} style={{ width: col.width }}>
              <input
                className="w-full bg-transparent outline-none focus:bg-white focus:ring-1 focus:ring-primary-500 rounded px-1 py-0.5"
                value={val}
                onChange={(e) => onEdit(r.__rowId, col.key, e.target.value)}
              />
            </div>
          );
        })}
      </div>
    );
  }

  const header = (
    <div className="flex sticky top-0 bg-white z-10 border-b border-gray-300 text-xs font-semibold text-gray-700 shadow-sm">
      {columns.map((c) => (
        <button
          key={c.key}
          className="p-3 border-r border-gray-200 text-left hover:bg-gray-100 transition-colors duration-150 flex items-center gap-1"
          style={{ width: c.width }}
          onClick={() => toggleSort(c.key)}
          title="Sort"
        >
          {c.label}
          {sort.key === c.key && (
            <span className="text-primary-600 font-bold">{sort.direction === 'asc' ? '▲' : '▼'}</span>
          )}
        </button>
      ))}
    </div>
  );

  const totalTableWidth = columns.reduce((a, c) => a + c.width, 0);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 text-xs bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Rows:</span>
          <span className="font-semibold text-gray-800">{total}</span>
        </div>
        <div className="flex items-center gap-1 self-start sm:self-auto">
          <button 
            className="px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150" 
            onClick={() => setPage(0)} 
            disabled={currentPage === 0}
            title="First page"
          >
            ⏮
          </button>
          <button 
            className="px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150" 
            onClick={() => setPage(Math.max(0, currentPage - 1))} 
            disabled={currentPage === 0}
            title="Previous page"
          >
            ◀
          </button>
          <span className="px-3 py-1 text-gray-700 font-medium">
            Page {currentPage + 1} / {totalPages}
          </span>
          <button 
            className="px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150" 
            onClick={() => setPage(Math.min(totalPages - 1, currentPage + 1))} 
            disabled={currentPage >= totalPages - 1}
            title="Next page"
          >
            ▶
          </button>
          <button 
            className="px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150" 
            onClick={() => setPage(totalPages - 1)} 
            disabled={currentPage >= totalPages - 1}
            title="Last page"
          >
            ⏭
          </button>
        </div>
      </div>
      {/* Scroll container allows horizontal/vertical scrolling on small screens */}
      <div className="overflow-auto">
        {/* Inner width matches total columns width so it can scroll on small screens */}
        <div style={{ width: totalTableWidth }}>
          {header}
          <div className="h-[360px] sm:h-[420px] md:h-[520px] bg-white">
            <List height={520} itemCount={paged.length} itemSize={40} width={totalTableWidth}>
              {RowRenderer}
            </List>
          </div>
        </div>
      </div>
    </div>
  );
}


