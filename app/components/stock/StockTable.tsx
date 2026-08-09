import type { StockRecord } from '@/types/Stock';

type Props = {
  records: StockRecord[];
};

function getLocationLabel(type: StockRecord['locationType']) {
  switch (type) {
    case 'PICKING':
      return 'Picking';
    case 'EN_PUERTA':
      return 'En puerta';
    case 'AVERIAS':
      return 'Averías';
  }
}

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
              key={record.id}
              className="border-b last:border-0"
              style={{
                borderColor: 'var(--color-border-light)',
              }}
            >
              <td
                className="px-5 py-4 text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                {record.locationCode}
              </td>

              <td className="px-5 py-4">
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{
                    backgroundColor:
                      record.locationType === 'PICKING'
                        ? 'var(--color-success-light)'
                        : record.locationType === 'EN_PUERTA'
                          ? 'var(--color-warning-light)'
                          : 'var(--color-danger-light)',

                    color:
                      record.locationType === 'PICKING'
                        ? 'var(--color-success)'
                        : record.locationType === 'EN_PUERTA'
                          ? 'var(--color-warning)'
                          : 'var(--color-danger)',
                  }}
                >
                  {getLocationLabel(record.locationType)}
                </span>
              </td>

              <td
                className="px-5 py-4 text-sm"
                style={{ color: 'var(--color-text)' }}
              >
                {record.count}
              </td>

              <td
                className="px-5 py-4 text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {record.dueDate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
