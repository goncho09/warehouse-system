import type { ReactNode } from 'react';

type Props = {
  eyebrow?: string;
  title: string;
  actions?: ReactNode;
};

export default function PageHeader({ eyebrow, title, actions }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p
            className="mb-1 text-sm"
            style={{
              color: 'var(--color-text-secondary)',
            }}
          >
            {eyebrow}
          </p>
        )}

        <h1
          className="text-2xl font-semibold"
          style={{
            color: 'var(--color-text)',
          }}
        >
          {title}
        </h1>
      </div>

      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
