import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  isLight: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * `?theme=light` / `?theme=dark` wins over the stored preference.
 *
 * The device room (scripts/device-room/) reviews the app inside frames served from
 * another origin, and `localStorage` is partitioned by origin — so the room cannot
 * seed a theme the frames will read. A query parameter is the one channel that
 * crosses that boundary. Nothing is persisted from it: the stored preference is
 * written only by an actual toggle, so a shared link cannot silently re-theme the
 * visitor's own session.
 */
function themeFromUrl(): Theme | null {
  try {
    const requested = new URLSearchParams(window.location.search).get('theme');
    return requested === 'light' || requested === 'dark' ? requested : null;
  } catch {
    return null; // A malformed query string must not stop the app from booting.
  }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const fromUrl = themeFromUrl();
    if (fromUrl) return fromUrl;
    try {
      const saved = localStorage.getItem('nexg_theme');
      return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      // Only a genuine choice is persisted; a theme imposed by the URL is not.
      if (!themeFromUrl()) localStorage.setItem('nexg_theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isLight: theme === 'light',
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
