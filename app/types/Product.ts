export type ProductCategory = 'FOOD' | 'NO_FOOD' | 'CONGELADO' | 'REFRIGERADO';

export interface Product {
  id: number;
  codigoProducto: string;
  descripcion: string;
  categoria: ProductCategory;
  unidadesPorDisplay: number;
  stock: number;
}
