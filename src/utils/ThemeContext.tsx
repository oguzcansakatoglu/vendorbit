import {ColorPalette, getColors} from './palette';
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: ColorPalette;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load the theme preference when the component mounts
    loadThemePreference();
  }, []);

  useEffect(() => {
    // Save the theme preference whenever it changes
    if (!isLoading) {
      saveThemePreference();
    }
  }, [isDarkMode, isLoading]);

  const loadThemePreference = async () => {
    try {
      const value = await AsyncStorage.getItem('isDarkMode');
      if (value !== null) {
        setIsDarkMode(value === 'true');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemePreference = async () => {
    try {
      await AsyncStorage.setItem('isDarkMode', isDarkMode.toString());
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const colors = getColors(isDarkMode ? 'dark' : 'light');

  if (isLoading) {
    // You might want to return a loading indicator here
    return null;
  }

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
