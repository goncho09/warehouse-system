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
            <th className="px-5 py-4 font-medium">Producto</th>
            <th className="px-5 py-4 font-medium">Lote</th>
            <th className="px-5 py-4 font-medium">Vencimiento</th>
            <th className="px-5 py-4 font-medium">Cantidad</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            const product = products.find(
              (product) => String(product.id) === item.productId,
            );

            return (
              <tr
                key={`${item.productId}-${item.lot}`}
                className="border-b last:border-0"
                style={{
                  borderColor: 'var(--color-border-light)',
                }}
              >
                <td className="px-5 py-4">
                  <p
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {product?.description ?? 'Producto no encontrado'}
                  </p>

                  <p
                    className="mt-0.5 text-xs"
                    style={{
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {product?.productId}
                  </p>
                </td>

                <td className="px-5 py-4 text-sm">{item.lot}</td>

                <td className="px-5 py-4 text-sm">{item.dueDate}</td>

                <td className="px-5 py-4 text-sm font-medium">{item.count}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
