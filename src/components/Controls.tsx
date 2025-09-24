import React from 'react';
import { downloadBooksCsv } from '../utils/csv';
import { BookRow } from '../types';

type Props = {
  rows: BookRow[];
  onReset: () => void;
  onGenerateFake: () => void;
  hasData: boolean;
};

export function Controls(props: Props) {
  const { rows, onReset, onGenerateFake, hasData } = props;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => downloadBooksCsv(rows, 'books_edited.csv')}
        disabled={!hasData}
      >
        💾 Download CSV
      </button>
      <button
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onReset}
        disabled={!hasData}
      >
        🔄 Reset All Edits
      </button>
      <button
        className="px-4 py-2 border border-primary-300 rounded-lg text-sm font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 hover:border-primary-400 transition-colors duration-200 shadow-sm"
        onClick={onGenerateFake}
      >
        🎲 Generate 10,000 Fake Rows
      </button>
    </div>
  );
}


