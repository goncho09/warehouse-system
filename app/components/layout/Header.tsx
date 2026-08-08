import { Bell } from 'lucide-react';

export default function Header() {
  return (
    <header
      className="flex h-16 items-center justify-between border-b px-6"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div>
        <h1
          className="text-lg font-semibold"
          style={{ color: 'var(--color-text)' }}
        >
          Depósito Central
        </h1>
      </div>

      <div className="flex items-center gap-5">
        <button
          type="button"
          className="relative rounded-lg p-2 transition-colors"
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label="Notificaciones"
        >
          <Bell size={20} strokeWidth={1.8} />

          <span
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
        </button>

        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold"
            style={{
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary-dark)',
            }}
          >
            G
          </div>

          <div className="hidden sm:block">
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--color-text)' }}
            >
              Gonzalo
            </p>

            <p
              className="text-xs"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Operador
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
