import { Product } from '@/types/Product';

export const products: Product[] = [
  {
    id: 1,
    codigoProducto: 'PRD-1001',
    descripcion: 'Coca-Cola 1.5L',
    categoria: 'FOOD',
    unidadesPorDisplay: 6,
    stock: 184,
  },
  {
    id: 2,
    codigoProducto: 'PRD-1002',
    descripcion: 'Red Bull 250ml',
    categoria: 'FOOD',
    unidadesPorDisplay: 24,
    stock: 96,
  },
  {
    id: 3,
    codigoProducto: 'PRD-1003',
    descripcion: 'Papas Chips 150g',
    categoria: 'FOOD',
    unidadesPorDisplay: 12,
    stock: 42,
  },
  {
    id: 4,
    codigoProducto: 'PRD-1004',
    descripcion: 'Helado Chocolate 1L',
    categoria: 'CONGELADO',
    unidadesPorDisplay: 6,
    stock: 30,
  },
  {
    id: 5,
    codigoProducto: 'PRD-1005',
    descripcion: 'Detergente 500ml',
    categoria: 'NO_FOOD',
    unidadesPorDisplay: 12,
    stock: 64,
  },
];
