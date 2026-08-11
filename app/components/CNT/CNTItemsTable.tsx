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
      className="overflow-hidden rounded-xl border"
      style={{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-surface)',
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
            <th className="px-5 py-4 font-medium">Código</th>
            <th className="px-5 py-4 font-medium">Código de barras</th>
            <th className="px-5 py-4 font-medium">Descripción</th>
            <th className="px-5 py-4 font-medium">Lote</th>
            <th className="px-5 py-4 font-medium">Vencimiento</th>
            <th className="px-5 py-4 font-medium">Cantidad</th>
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

                <td className="px-5 py-4 text-sm">{product?.barCode}</td>

                <td className="px-5 py-4 text-sm">
                  {product?.description ?? 'Producto no encontrado'}
                </td>

                <td className="px-5 py-4 text-sm">{item.lot}</td>

                <td className="px-5 py-4 text-sm">
                  {item.dueDate
                    ? new Date(`${item.dueDate}T00:00:00`).toLocaleDateString(
                        'es-UY',
                      )
                    : 'N/A'}
                </td>

                <td className="px-5 py-4 text-sm font-medium">{item.count}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
