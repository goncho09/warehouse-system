import { Product } from '@/types/Product';

export const products: Product[] = [
  {
    id: 'PRD-1001',
    barCode: '1234567890123',
    description: 'Coca-Cola 1.5L',
    category: 'FOOD',
    unitsPerDisplay: 6,
    stock: 184,
  },
  {
    id: 'PRD-1002',
    barCode: '9876543210987',
    description: 'Red Bull 250ml',
    category: 'FOOD',
    unitsPerDisplay: 24,
    stock: 96,
  },
  {
    id: 'PRD-1003',
    barCode: '4567890123456',
    description: 'Papas Chips 150g',
    category: 'FOOD',
    unitsPerDisplay: 12,
    stock: 42,
  },
  {
    id: 'PRD-1004',
    barCode: '7890123456789',
    description: 'Helado Chocolate 1L',
    category: 'CONGELADO',
    unitsPerDisplay: 6,
    stock: 30,
  },
  {
    id: 'PRD-1005',
    barCode: '3210987654321',
    description: 'Detergente 500ml',
    category: 'NO_FOOD',
    unitsPerDisplay: 12,
    stock: 64,
  },
];
