import type { ReactNode } from 'react';

type Variant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

type Props = {
  children: ReactNode;
  variant?: Variant;
};

const styles: Record<
  Variant,
  {
    backgroundColor: string;
    color: string;
  }
> = {
  primary: {
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
  },

  success: {
    backgroundColor: 'var(--color-success-light)',
    color: 'var(--color-success)',
  },

  warning: {
    backgroundColor: 'var(--color-warning-light)',
    color: 'var(--color-warning)',
  },

  danger: {
    backgroundColor: 'var(--color-danger-light)',
    color: 'var(--color-danger)',
  },

  neutral: {
    backgroundColor: 'var(--color-border-light)',
    color: 'var(--color-text-secondary)',
  },
};

export default function StatusBadge({ children, variant = 'neutral' }: Props) {
  return (
    <span
      className="inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
      style={styles[variant]}
    >
      {children}
    </span>
  );
}
