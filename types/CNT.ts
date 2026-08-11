type CNTStatus = 'ACTIVO' | 'FINALIZADO';

type LocationType = 'PICKING' | 'EN_PUERTA' | 'FLOTANTE' | 'AVERIAS';

export interface CNTItem {
  productId: string;
  lot: string;
  dueDate: string;
  count: number;
}

export interface CNT {
  id: number;
  code: string;
  status: CNTStatus;
  locationCode: string;
  locationType: LocationType;
  items: CNTItem[];
}
