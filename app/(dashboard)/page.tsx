import {
  Package,
  Boxes,
  TriangleAlert,
  CalendarClock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const stats = [
  {
    title: 'Productos',
    value: '248',
    description: '+8 esta semana',
    icon: Package,
    color: 'var(--color-primary)',
    background: 'var(--color-primary-light)',
    trend: 'up',
  },
  {
    title: 'Stock total',
    value: '12.450',
    description: '+5,2% esta semana',
    icon: Boxes,
    color: 'var(--color-primary)',
    background: 'var(--color-primary-light)',
    trend: 'up',
  },
  {
    title: 'Stock bajo',
    value: '12',
    description: 'Requieren atención',
    icon: TriangleAlert,
    color: 'var(--color-warning)',
    background: 'var(--color-warning-light)',
    trend: 'warning',
  },
  {
    title: 'Próximos a vencer',
    value: '5',
    description: 'En los próximos 7 días',
    icon: CalendarClock,
    color: 'var(--color-danger)',
    background: 'var(--color-danger-light)',
    trend: 'danger',
  },
];

const lowStockProducts = [
  {
    name: 'Coca-Cola 1.5L',
    stock: 12,
    minimum: 20,
  },
  {
    name: 'Arroz 1kg',
    stock: 8,
    minimum: 15,
  },
  {
    name: 'Leche Conaprole 1L',
    stock: 14,
    minimum: 25,
  },
  {
    name: 'Papas Chips 150g',
    stock: 6,
    minimum: 12,
  },
];

const recentActivity = [
  {
    title: 'Coca-Cola 1.5L actualizado',
    description: 'Stock modificado',
    time: 'Hace 10 minutos',
  },
  {
    title: 'Arroz 1kg agregado',
    description: 'Nuevo producto',
    time: 'Hace 25 minutos',
  },
  {
    title: 'Leche Conaprole 1L actualizado',
    description: 'Stock modificado',
    time: 'Hace 1 hora',
  },
  {
    title: 'Papas Chips 150g actualizado',
    description: 'Stock modificado',
    time: 'Hace 2 horas',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-8">
      {/* Encabezado */}
      <section className="mb-8">
        <p
          className="mb-1 text-sm font-medium"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Resumen del depósito
        </p>

        <h2
          className="text-2xl font-semibold"
          style={{ color: 'var(--color-text)' }}
        >
          Dashboard
        </h2>
      </section>

      {/* Estadísticas */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border p-5"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="mb-4 flex items-start justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: stat.background,
                    color: stat.color,
                  }}
                >
                  <Icon size={20} strokeWidth={1.8} />
                </div>

                {stat.trend === 'up' && (
                  <div
                    className="flex items-center gap-1 text-xs font-medium"
                    style={{ color: 'var(--color-success)' }}
                  >
                    <ArrowUpRight size={15} />
                    Tendencia positiva
                  </div>
                )}
              </div>

              <p
                className="mb-1 text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {stat.title}
              </p>

              <p
                className="text-2xl font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                {stat.value}
              </p>

              <p
                className="mt-2 text-xs"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {stat.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Información secundaria */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* Stock bajo */}
        <div
          className="overflow-hidden rounded-xl border xl:col-span-3"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between border-b px-6 py-5">
            <div>
              <h3
                className="font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                Productos con stock bajo
              </h3>

              <p
                className="mt-1 text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Productos que requieren atención
              </p>
            </div>

            <button
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--color-primary)' }}
            >
              Ver todos
            </button>
          </div>

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
                  <th className="px-6 py-3 font-medium">Producto</th>
                  <th className="px-6 py-3 font-medium">Stock</th>
                  <th className="px-6 py-3 font-medium">Mínimo</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                </tr>
              </thead>

              <tbody>
                {lowStockProducts.map((product) => (
                  <tr
                    key={product.name}
                    className="border-b last:border-0"
                    style={{ borderColor: 'var(--color-border-light)' }}
                  >
                    <td
                      className="px-6 py-4 text-sm font-medium"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {product.name}
                    </td>

                    <td
                      className="px-6 py-4 text-sm"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {product.stock}
                    </td>

                    <td
                      className="px-6 py-4 text-sm"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {product.minimum}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: 'var(--color-warning-light)',
                          color: 'var(--color-warning)',
                        }}
                      >
                        Stock bajo
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actividad reciente */}
        <div
          className="rounded-xl border xl:col-span-2"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="border-b px-6 py-5">
            <h3
              className="font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              Actividad reciente
            </h3>

            <p
              className="mt-1 text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Últimos movimientos
            </p>
          </div>

          <div className="px-6">
            {recentActivity.map((activity, index) => (
              <div
                key={activity.title}
                className="flex gap-3 border-b py-4 last:border-0"
                style={{ borderColor: 'var(--color-border-light)' }}
              >
                <div className="mt-1">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  />
                </div>

                <div className="min-w-0">
                  <p
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {activity.title}
                  </p>

                  <p
                    className="mt-1 text-xs"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {activity.description}
                  </p>

                  <p
                    className="mt-1 text-xs"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
