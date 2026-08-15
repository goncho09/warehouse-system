import type { CNTItem } from '@/types/CNT';
import type { Product } from '@/types/Product';

type Props = {
  items: CNTItem[];
  products: Product[];
};

export default function CNTItemsTable({ items, products }: Props) {
  if (items.length === 0) {
    return (
      <div
        className="rounded-xl border p-8 text-center text-sm"
        style={{
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-secondary)',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        Este CNT no contiene productos.
      </div>
    );
  }

  return (
    <section
      className="flex h-full min-h-0 flex-col rounded-xl border"
      style={{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-surface)',
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
                Código
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-medium sm:px-5 sm:py-4">
                Código de barras
              </th>
              <th className="min-w-56 px-3 py-3 font-medium sm:px-5 sm:py-4">
                Descripción
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-medium sm:px-5 sm:py-4">
                Lote
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-medium sm:px-5 sm:py-4">
                Vencimiento
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-medium sm:px-5 sm:py-4">
                Cantidad
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const product = products.find(
                (product) => product.productId === item.productId,
              );

              return (
                <tr
                  key={`${item.productId}-${item.lot}`}
                  className="border-b last:border-0"
                  style={{
                    borderColor: 'var(--color-border-light)',
                  }}
                >
                  <td className="px-5 py-4">{item.productId}</td>

                  <td className="whitespace-nowrap px-3 py-3 text-sm sm:px-5 sm:py-4">
                    {product?.barCode}
                  </td>

                  <td className="min-w-56 px-3 py-3 text-sm sm:px-5 sm:py-4">
                    {product?.description ?? 'Producto no encontrado'}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 text-sm sm:px-5 sm:py-4">
                    {item.lot}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 text-sm sm:px-5 sm:py-4">
                    {item.dueDate
                      ? new Date(`${item.dueDate}T00:00:00`).toLocaleDateString(
                          'es-UY',
                        )
                      : 'N/A'}
                  </td>

                  <td className="px-5 py-4 text-sm font-medium">
                    {item.count}
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
