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
              <th className="px-5 py-4 font-medium">Producto</th>
              <th className="px-5 py-4 font-medium">Lote</th>
              <th className="px-5 py-4 font-medium">Vencimiento</th>
              <th className="px-5 py-4 font-medium">Cantidad</th>
              <th className="px-5 py-4 font-medium">PYA</th>
              <th className="px-5 py-4 font-medium">Ubicación</th>
            </tr>
          </thead>

          <tbody>
            {entries.map((entry) => {
              const product = products.find(
                (product) => product.id === entry.productoId,
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
                    {product?.descripcion ?? 'Producto no encontrado'}
                  </td>

                  <td
                    className="px-5 py-4 text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {entry.lote}
                  </td>

                  <td
                    className="px-5 py-4 text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {entry.vencimiento}
                  </td>

                  <td
                    className="px-5 py-4 text-sm font-medium"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {entry.cantidad}
                  </td>

                  <td
                    className="px-5 py-4 text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {entry.codigoPya}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: 'var(--color-warning-light)',
                        color: 'var(--color-warning)',
                      }}
                    >
                      En puerta
                    </span>
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
