'use client';

import {
  LayoutDashboard,
  Package,
  MapPin,
  ClipboardList,
  Settings,
  PackagePlus,
  Boxes,
  Container,
  X,
} from 'lucide-react';
import Link from 'next/link';

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

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: Props) {
  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 shrink-0 flex-col
          transition-transform duration-300 ease-out
          md:static md:z-auto md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          backgroundColor: 'var(--color-dark)',
        }}
      >
        <div className="flex h-16 items-center border-b px-4 sm:px-6">
          <Link
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{
              backgroundColor: 'var(--color-primary)',
            }}
            href="/"
            onClick={onClose}
          >
            <Package size={20} color="white" strokeWidth={2} />
          </Link>

          <div className="ml-3 min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              Depósito Central
            </p>

            <p
              className="truncate text-xs"
              style={{
                color: 'var(--color-text-muted)',
              }}
            >
              Gestión de inventario
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
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
                  onClick={onClose}
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
                      shrink-0
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

        <div className="border-t p-3">
          <a
            href="/configuracion"
            onClick={onClose}
            className="
              flex items-center gap-3 rounded-lg
              px-3 py-2.5 text-sm font-medium
              transition-colors
              hover:bg-(--color-primary-light)
              hover:text-(--color-primary)
            "
            style={{
              color: 'var(--color-text-muted)',
            }}
          >
            <Settings size={19} strokeWidth={1.8} />

            <span>Configuración</span>
          </a>
        </div>
      </aside>
    </>
  );
}
