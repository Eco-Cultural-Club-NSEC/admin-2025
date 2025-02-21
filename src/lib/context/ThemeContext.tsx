import React from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggle: () => void;
}

export const ThemeContext = React.createContext<ThemeContextType>({
  isDark: false,
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = React.useState(() => {
    const saved = localStorage.getItem('theme-mode');
    return saved ? JSON.parse(saved) : false;
  });

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggle = React.useCallback(() => {
    setIsDark((prev) => {
      const newValue = !prev;
      localStorage.setItem('theme-mode', JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  const value = React.useMemo(() => ({ isDark, toggle }), [isDark, toggle]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}