export function formatCNTCode(id: number) {
  return `CNT-${id.toString().padStart(6, '0')}`;
}

export function formatEntryLocationCode(id: number) {
  return `PUE${id.toString().padStart(6, '0')}`;
}

export function formatFloatingLocationCode(id: number) {
  return `Z${id.toString().padStart(6, '0')}`;
}
