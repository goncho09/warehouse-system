export type ProductCategory = 'FOOD' | 'NO_FOOD' | 'CONGELADO' | 'REFRIGERADO';

export interface Product {
  id: string;
  barCode: string;
  description: string;
  category: ProductCategory;
  unitsPerDisplay: number;
  stock: number;
}
