'use client';

import type { Entry } from '@/types/Entry';
import type { Product } from '@/types/Product';

type Props = {
  entries: Entry[];
  products: Product[];
};

export default function EntriesTable({ entries, products }: Props) {
  if (entries.length === 0) {
    return (
      <div
        className="rounded-xl border p-10 text-center text-sm"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-secondary)',
        }}
      >
        Todavía no hay ingresos registrados.
      </div>
    );
  }

  return (
    <section
      className="overflow-hidden rounded-xl border"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="relative overflow-x-auto">
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
                Product ID
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-medium sm:px-5 sm:py-4">
                Lote
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-medium sm:px-5 sm:py-4">
                Código de barras
              </th>
              <th className="min-w-56 px-3 py-3 font-medium sm:px-5 sm:py-4">
                Descripción
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-medium sm:px-5 sm:py-4">
                Vencimiento
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-medium sm:px-5 sm:py-4">
                Cantidad
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-medium sm:px-5 sm:py-4">
                Contenedor
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-medium sm:px-5 sm:py-4">
                Fecha ingreso
              </th>
            </tr>
          </thead>

          <tbody>
            {entries.map((entry) => {
              const product = products.find(
                (product) => product.productId === entry.productId,
              );

              return (
                <tr
                  key={entry.id}
                  className="border-b last:border-0"
                  style={{
                    borderColor: 'var(--color-border-light)',
                  }}
                >
                  <td
                    className="px-5 py-4 text-sm font-medium"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {entry.productId}
                  </td>

                  <td
                    className="px-5 py-4 text-sm"
                    style={{
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {entry.lot}
                  </td>

                  <td
                    className="px-5 py-4 text-sm"
                    style={{
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {product?.barCode ?? 'N/A'}
                  </td>

                  <td
                    className="px-5 py-4 text-sm"
                    style={{
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {product?.description ?? 'N/A'}
                  </td>

                  <td
                    className="px-5 py-4 text-sm"
                    style={{
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {entry.dueDate
                      ? new Intl.DateTimeFormat('es-UY', {
                          timeZone: 'America/Montevideo',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        }).format(new Date(`${entry.dueDate}T00:00:00`))
                      : 'N/A'}
                  </td>

                  <td
                    className="px-5 py-4 text-sm font-medium"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {entry.count}
                  </td>

                  <td
                    className="px-5 py-4 text-sm font-medium"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {entry.cntCode}
                  </td>

                  <td
                    className="px-5 py-4 text-sm"
                    style={{
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {new Intl.DateTimeFormat('es-UY', {
                      timeZone: 'America/Montevideo',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    }).format(new Date(entry.entryDate))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
