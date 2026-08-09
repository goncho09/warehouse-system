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
              <th className="px-5 py-4 font-medium">Product ID</th>
              <th className="px-5 py-4 font-medium">Lote</th>
              <th className="px-5 py-4 font-medium">Código de barras</th>
              <th className="px-5 py-4 font-medium">Vencimiento</th>
              <th className="px-5 py-4 font-medium">Cantidad</th>
              <th className="px-5 py-4 font-medium">Contenedor</th>
              <th className="px-5 py-4 font-medium">Fecha ingreso</th>
            </tr>
          </thead>

          <tbody>
            {entries.map((entry) => {
              const product = products.find(
                (product) => product.id === entry.productId,
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
                    {entry.dueDate
                      ? new Date(
                          `${entry.dueDate}T00:00:00`,
                        ).toLocaleDateString()
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
                    {entry.cntId}
                  </td>

                  <td
                    className="px-5 py-4 text-sm"
                    style={{
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {new Date(entry.entryDate).toLocaleString()}
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
