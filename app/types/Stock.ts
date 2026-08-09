export type LocationType = 'PICKING' | 'EN_PUERTA' | 'AVERIAS';

export interface StockRecord {
  id: number;
  productId: number;
  locationCode: string;
  locationType: LocationType;
  count: number;
  dueDate: string;
}
