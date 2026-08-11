export type ProductCategory = 'FOOD' | 'NO_FOOD' | 'CONGELADO' | 'REFRIGERADO';

export interface Product {
  id: number;
  productId: string;
  barCode: string;
  description: string;
  category: ProductCategory;
  unitsPerDisplay: number;
  createdAt?: Date;
  updatedAt?: Date;
}
