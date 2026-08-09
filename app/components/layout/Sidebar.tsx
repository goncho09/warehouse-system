'use client';

import {
  LayoutDashboard,
  Package,
  Tags,
  MapPin,
  ClipboardList,
  Settings,
  PackagePlus,
  Boxes,
  Container,
} from 'lucide-react';

const menuItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    label: 'Productos',
    icon: Package,
    href: '/productos',
  },
  {
    label: 'CNT',
    icon: Container,
    href: '/cnt',
  },
  {
    label: 'Stock',
    icon: Boxes,
    href: '/stock',
  },
  {
    label: 'Ubicaciones',
    icon: MapPin,
    href: '/ubicaciones',
  },
  {
    label: 'Ingresos',
    icon: PackagePlus,
    href: '/ingresos',
  },
  {
    label: 'Pedidos',
    icon: ClipboardList,
    href: '/pedidos',
  },
];

export default function Sidebar() {
  return (
    <aside
      className="flex w-64 shrink-0 flex-col"
      style={{
        backgroundColor: 'var(--color-dark)',
      }}
    >
      <div className="flex h-16 items-center border-b px-6">
        <a
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{
            backgroundColor: 'var(--color-primary)',
          }}
          href="/"
        >
          <Package size={20} color="white" strokeWidth={2} />
        </a>

        <div className="ml-3">
          <p className="text-sm font-semibold text-white">Depósito Central</p>

          <p
            className="text-xs"
            style={{
              color: 'var(--color-text-muted)',
            }}
          >
            Gestión de inventario
          </p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-5">
        <p
          className="mb-3 px-3 text-xs font-medium uppercase tracking-wider"
          style={{
            color: 'var(--color-text-muted)',
          }}
        >
          Principal
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href}
                className="
    group flex items-center gap-3 rounded-lg px-3 py-2.5
    text-sm font-medium
    text-(--color-text-muted)
    transition-all duration-300 ease-out
    hover:translate-x-0.5
    hover:bg-(--color-primary-light)
    hover:text-(--color-primary)
  "
              >
                <Icon
                  size={19}
                  className="
      transition-transform duration-300 ease-out
      group-hover:scale-105
    "
                />

                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* Configuración */}
      <div className="border-t p-3">
        <a
          href="/configuracion"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium"
          style={{
            color: 'var(--color-text-muted)',
          }}
        >
          <Settings size={19} strokeWidth={1.8} />

          <span>Configuración</span>
        </a>
      </div>
    </aside>
  );
}
