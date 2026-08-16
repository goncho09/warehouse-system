export type OrderStatus = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO';

export type Destination =
  | 'LA_BLANQUEADA'
  | 'CARRASCO_NORTE'
  | 'TRES_CRUCES'
  | 'SAYAGO'
  | 'CIUDAD_DE_LA_COSTA'
  | 'MALVIN_NORTE'
  | 'AGUADA'
  | 'BRAZO_ORIENTAL';

export type OrderCategory = 'FOOD' | 'NO_FOOD' | 'CONGELADO' | 'REFRIGERADO';

export interface OrderItem {
  id: number;
  productId: string;
  description: string;
  requestedCount: number;
  pickedCount: number;
  cancelledCount: number;
}

export interface Order {
  id: number;
  stoCode: string;
  preparationCode: string;
  destination: Destination;
  status: OrderStatus;
  departureDate: string;
  category: OrderCategory;
  items: OrderItem[];
}
