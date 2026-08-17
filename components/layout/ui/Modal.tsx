'use client';

import { X } from 'lucide-react';

import type { ReactNode } from 'react';

type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '5xl';

type Props = {
  isOpen: boolean;
  onClose: () => void;

  title: ReactNode;
  subtitle?: ReactNode;

  children: ReactNode;
  footer?: ReactNode;

  maxWidth?: MaxWidth;
};

const maxWidthClasses: Record<MaxWidth, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '5xl': 'max-w-5xl',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'lg',
}: Props) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div
        className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-xl border ${maxWidthClasses[maxWidth]}`}
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div
          className="flex shrink-0 items-start justify-between gap-4 border-b px-4 py-4 sm:px-6"
          style={{
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="min-w-0">
            <h2
              className="text-lg font-semibold"
              style={{
                color: 'var(--color-text)',
              }}
            >
              {title}
            </h2>

            {subtitle && (
              <div
                className="mt-1 text-sm"
                style={{
                  color: 'var(--color-text-secondary)',
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="shrink-0 rounded-lg p-2 transition-colors hover:bg-(--color-surface-hover)"
            style={{
              color: 'var(--color-text-secondary)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">{children}</div>

        {footer && (
          <div
            className="shrink-0 border-t px-4 py-4 sm:px-6"
            style={{
              borderColor: 'var(--color-border)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
