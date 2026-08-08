import { Product } from '@/types/Product';

export const products: Product[] = [
  {
    id: 1,
    productId: 'PRD-1001',
    description: 'Coca-Cola 1.5L',
    category: 'FOOD',
    unitsPerDisplay: 6,
    stock: 184,
  },
  {
    id: 2,
    productId: 'PRD-1002',
    description: 'Red Bull 250ml',
    category: 'FOOD',
    unitsPerDisplay: 24,
    stock: 96,
  },
  {
    id: 3,
    productId: 'PRD-1003',
    description: 'Papas Chips 150g',
    category: 'FOOD',
    unitsPerDisplay: 12,
    stock: 42,
  },
  {
    id: 4,
    productId: 'PRD-1004',
    description: 'Helado Chocolate 1L',
    category: 'CONGELADO',
    unitsPerDisplay: 6,
    stock: 30,
  },
  {
    id: 5,
    productId: 'PRD-1005',
    description: 'Detergente 500ml',
    category: 'NO_FOOD',
    unitsPerDisplay: 12,
    stock: 64,
  },
];
