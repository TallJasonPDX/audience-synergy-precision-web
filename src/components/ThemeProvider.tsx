import React, { createContext, useEffect, useState } from 'react';

export type Theme = 
  | 'healthcare-professional' 
  | 'light-blue-white'
  | 'navy-sky-blue'
  | 'cool-grey-blue'
  | 'soft-blue-gradient'
  | 'white-blue-monochrome'
  | 'warm-neutrals-navy'
  | 'charcoal-lime'
  | 'black-yellow'
  | 'slate-coral'
  | 'off-white-teal';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { value: Theme; label: string; description: string }[];
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('healthcare-professional');

  const themes = [
    {
      value: 'healthcare-professional' as Theme,
      label: 'Healthcare Professional',
      description: 'Original healthcare-focused design'
    },
    {
      value: 'light-blue-white' as Theme,
      label: 'Light Blue & White',
      description: 'Clean & Trustworthy'
    },
    {
      value: 'navy-sky-blue' as Theme,
      label: 'Navy & Sky Blue',
      description: 'Modern & Confident'
    },
    {
      value: 'cool-grey-blue' as Theme,
      label: 'Cool Grey & Blue',
      description: 'Neutral & Minimal'
    },
    {
      value: 'soft-blue-gradient' as Theme,
      label: 'Soft Blue Gradient',
      description: 'Tech-Forward'
    },
    {
      value: 'white-blue-monochrome' as Theme,
      label: 'White & Blue Monochrome',
      description: 'Sharp & Bold'
    },
    {
      value: 'warm-neutrals-navy' as Theme,
      label: 'Warm Neutrals + Deep Navy',
      description: 'Sophisticated & Calming'
    },
    {
      value: 'charcoal-lime' as Theme,
      label: 'Charcoal & Lime',
      description: 'Modern & Energetic'
    },
    {
      value: 'black-yellow' as Theme,
      label: 'Black & Yellow',
      description: 'Striking & Confident'
    },
    {
      value: 'slate-coral' as Theme,
      label: 'Slate + Coral',
      description: 'Fresh & Friendly'
    },
    {
      value: 'off-white-teal' as Theme,
      label: 'Off-White & Teal-Green',
      description: 'Clean & Balanced'
    }
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && themes.some(t => t.value === savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};