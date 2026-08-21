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

export type PickTask = {
  id: number;
  plannedCount: number;
  pickedCount: number;
  cancelledCount: number;
};

export type OrderItem = {
  id: number;
  productId: string;
  description: string;
  requestedCount: number;
  pickedCount: number;
  cancelledCount: number;
};

export type Order = {
  id: number;
  stoCode: string;
  preparationCode: string;
  destination: Destination;

  category: OrderCategory;

  status: OrderStatus;

  departureDate: string;

  items: OrderItem[];
  pickTasks: PickTask[];
};
