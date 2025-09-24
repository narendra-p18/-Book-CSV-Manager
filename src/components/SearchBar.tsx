import React from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function SearchBar(props: Props) {
  const { value, onChange } = props;

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search any column…"
        className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 shadow-sm"
      />
    </div>
  );
}


