export type Book = {
  Title: string;
  Author: string;
  Genre: string;
  PublishedYear: number;
  ISBN: string;
};

export type BookRow = Book & { __rowId: string };

export type ColumnKey = keyof Book;

export type SortState = {
  key: ColumnKey | null;
  direction: 'asc' | 'desc';
};

export type EditTracker = {
  // rowId -> key -> edited value
  [rowId: string]: Partial<Record<ColumnKey, string>>;
};


