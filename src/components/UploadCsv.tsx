import React from 'react';

type Props = {
  onFile: (file: File) => void;
  isLoading: boolean;
};

export function UploadCsv(props: Props) {
  const { onFile, isLoading } = props;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.currentTarget.value = '';
  }

  return (
    <div className="flex items-center gap-3">
      <label className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer text-sm font-medium bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 shadow-sm">
        <input type="file" accept=".csv" className="hidden" onChange={handleChange} disabled={isLoading} />
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            Parsing…
          </span>
        ) : (
          '📁 Upload CSV'
        )}
      </label>
    </div>
  );
}


