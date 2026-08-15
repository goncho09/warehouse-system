import type { StockRecord } from '@/types/Stock';

type Props = {
  records: StockRecord[];
};

export default function StockTable({ records }: Props) {
  return (
    <section
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr
              className="border-b text-left text-xs uppercase"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
            >
              <th className="whitespace-nowrap px-3 py-3 font-medium sm:px-5 sm:py-4">
                Ubicación
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-medium sm:px-5 sm:py-4">
                Tipo
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-medium sm:px-5 sm:py-4">
                Cantidad
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-medium sm:px-5 sm:py-4">
                Vencimiento
              </th>
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

                <td className="whitespace-nowrap px-3 py-3 text-sm sm:px-5 sm:py-4">
                  {record.locationType}
                </td>

                <td className="px-5 py-4 text-sm font-medium">
                  {record.count}
                </td>

                <td className="whitespace-nowrap px-3 py-3 text-sm sm:px-5 sm:py-4">
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
      </div>
    </section>
  );
}
