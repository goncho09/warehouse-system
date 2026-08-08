export interface Entry {
  id: number;
  productId: number;
  lot: string;
  dueDate: string;
  count: number;
  PYAID: string;
  entryDate: string;
}

export type EntryFormData = {
  productId: number;
  lot: string;
  dueDate: string;
  count: string;
  PYAID: string;
};
