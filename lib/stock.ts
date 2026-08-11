import type { LocationType } from '../types/Location';
import type { StockRecord } from '../types/Stock';

type StockItem = {
  id: number;
  productId: string;
  locationCode: string;
  locationType: LocationType;
  count: number;
  dueDate: string;
};

export function groupStockByLocation(items: StockItem[]): StockRecord[] {
  const grouped = new Map<string, StockRecord>();

  for (const item of items) {
    const key = `${item.productId}-${item.locationCode}`;

    const current = grouped.get(key);

    if (current) {
      current.count += item.count;
      continue;
    }

    grouped.set(key, {
      ...item,
    });
  }

  return Array.from(grouped.values());
}

export function getTotalStock(records: StockRecord[]) {
  return records.reduce((total, record) => total + record.count, 0);
}
