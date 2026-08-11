import type { LocationType } from '@/types/Location';

export interface StockRecord {
  id: number;
  productId: string;
  locationCode: string;
  locationType: LocationType;
  count: number;
  dueDate: string;
}
