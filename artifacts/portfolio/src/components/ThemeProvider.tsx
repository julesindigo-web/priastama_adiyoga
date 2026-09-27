import { useEffect } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Intentional: Royal Night is dark-only masterpiece theme.
    // Light tokens in index.css remain as fallback, dark is forced for brand consistency.
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  }, []);

  return <>{children}</>;
}
