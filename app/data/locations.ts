import type { Location } from '@/types/Location';

export const locations: Location[] = [
  {
    code: '160A0110104',
    type: 'PICKING',
    chamber: '160',
    row: '011',
    position: '01',
    height: '04',
  },
  {
    code: '160A0110204',
    type: 'PICKING',
    chamber: '160',
    row: '011',
    position: '02',
    height: '04',
  },
  {
    code: '160A0120102',
    type: 'PICKING',
    chamber: '160',
    row: '012',
    position: '01',
    height: '02',
  },
  {
    code: '160A0120202',
    type: 'PICKING',
    chamber: '160',
    row: '012',
    position: '02',
    height: '02',
  },

  {
    code: 'PUE001',
    type: 'EN_PUERTA',
  },
  {
    code: 'ZFL001',
    type: 'FLOTANTE',
  },
  {
    code: '160A0900101',
    type: 'AVERIAS',
  },
];
