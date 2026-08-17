'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

function subscribe() {
  return () => {};
}

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  const darkMode = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(darkMode ? 'light' : 'dark')}
      aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
      className="
        flex h-9 w-9 items-center justify-center
        rounded-lg
        text-(--color-text-secondary)
        transition-colors duration-200
        hover:bg-(--color-primary-light)
        hover:text-(--color-primary)
      "
    >
      {darkMode ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
