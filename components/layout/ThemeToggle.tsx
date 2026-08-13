'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  function toggleTheme() {
    const newDarkMode = !darkMode;

    document.documentElement.classList.toggle('dark', newDarkMode);

    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');

    setDarkMode(newDarkMode);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
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
