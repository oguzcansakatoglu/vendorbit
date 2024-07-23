import {ColorPalette, getColors} from './palette';
import React, {ReactNode, createContext, useContext, useState} from 'react';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: ColorPalette;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const colors = getColors(isDarkMode ? 'dark' : 'light');

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{isDarkMode, toggleTheme, colors}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
