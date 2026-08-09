import type { Location } from '@/types/Location';

type Props = {
  locations: Location[];
};

function getTypeLabel(type: Location['type']) {
  switch (type) {
    case 'PICKING':
      return 'Picking';
    case 'EN_PUERTA':
      return 'En puerta';
    case 'FLOTANTE':
      return 'Flotante';
    case 'AVERIAS':
      return 'Averías';
  }
}

export default function LocationsTable({ locations }: Props) {
  return (
    <section
      className="overflow-hidden rounded-xl border"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className="border-b text-left text-xs uppercase"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
            >
              <th className="px-5 py-4 font-medium">Código</th>
              <th className="px-5 py-4 font-medium">Tipo</th>
              <th className="px-5 py-4 font-medium">Cámara</th>
              <th className="px-5 py-4 font-medium">Fila</th>
              <th className="px-5 py-4 font-medium">Posición</th>
              <th className="px-5 py-4 font-medium">Altura</th>
            </tr>
          </thead>

          <tbody>
            {locations.map((location) => (
              <tr
                key={location.code}
                className="border-b last:border-0"
                style={{
                  borderColor: 'var(--color-border-light)',
                }}
              >
                <td
                  className="px-5 py-4 text-sm font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  {location.code}
                </td>

                <td className="px-5 py-4">
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{
                      backgroundColor:
                        location.type === 'PICKING'
                          ? 'var(--color-success-light)'
                          : location.type === 'EN_PUERTA'
                            ? 'var(--color-warning-light)'
                            : 'var(--color-danger-light)',
                      color:
                        location.type === 'PICKING'
                          ? 'var(--color-success)'
                          : location.type === 'EN_PUERTA'
                            ? 'var(--color-warning)'
                            : 'var(--color-danger)',
                    }}
                  >
                    {getTypeLabel(location.type)}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm">{location.chamber ?? '-'}</td>

                <td className="px-5 py-4 text-sm">{location.row ?? '-'}</td>

                <td className="px-5 py-4 text-sm">
                  {location.position ?? '-'}
                </td>

                <td className="px-5 py-4 text-sm">{location.height ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
