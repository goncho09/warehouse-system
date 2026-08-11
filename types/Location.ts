export type LocationType = 'PICKING' | 'EN_PUERTA' | 'FLOTANTE' | 'AVERIAS';

export interface Location {
  code: string;
  type: LocationType;

  chamber?: string;
  row?: string;
  position?: string;
  height?: string;
}
