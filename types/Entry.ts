export interface Entry {
  id: number;
  productId: string;
  lot: string;
  dueDate: string;
  count: number;
  cntCode: string;
  entryDate: string;
}

export type EntryFormData = {
  productId: string;
  barCode: string;
  lot: string;
  dueDate: string;
  count: string;
  cntCode: string;
};
