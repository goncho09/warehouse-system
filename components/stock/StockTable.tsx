import type { StockRecord } from '@/types/Stock';

type Props = {
  records: StockRecord[];
};

export default function StockTable({ records }: Props) {
  return (
    <section
      className="overflow-hidden rounded-xl border"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <table className="w-full">
        <thead>
          <tr
            className="border-b text-left text-xs uppercase"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-muted)',
            }}
          >
            <th className="px-5 py-4 font-medium">Ubicación</th>
            <th className="px-5 py-4 font-medium">Tipo</th>
            <th className="px-5 py-4 font-medium">Cantidad</th>
            <th className="px-5 py-4 font-medium">Vencimiento</th>
          </tr>
        </thead>

        <tbody>
          {records.map((record) => (
            <tr
              key={`${record.productId}-${record.locationCode}`}
              className="border-b last:border-0"
              style={{
                borderColor: 'var(--color-border-light)',
              }}
            >
              <td className="px-5 py-4 text-sm font-medium">
                {record.locationCode}
              </td>

              <td className="px-5 py-4 text-sm">{record.locationType}</td>

              <td className="px-5 py-4 text-sm font-medium">{record.count}</td>

              <td className="px-5 py-4 text-sm">
                {record.dueDate
                  ? new Date(`${record.dueDate}T00:00:00`).toLocaleDateString(
                      'es-UY',
                    )
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
