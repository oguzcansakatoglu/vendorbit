// palette.ts

import {ColorSchemeName} from 'react-native';

const lightColors = {
  primary: '#f5f5f5',
  secondary: '3b3b3b',
  accent: '#5b5b5b',
  background: '#f5f5f5',
  surface: '#ffffff',
  text: '#1b1b1b',
  textSecondary: '#9b9b9b',
  border: '#bdc3c7',
  error: '#e74c3c',
};

const darkColors = {
  primary: '#1b1b1b',
  secondary: '#5b5b5b',
  accent: '#5b5b5b',
  background: '#1b1b1b',
  surface: '#1b1b1b',
  text: '#f5f5f5',
  textSecondary: '#5b5b5b',
  border: '#7f8c8d',
  error: '#e74c3c',
};

export type ColorPalette = typeof lightColors;

export const getColors = (colorScheme: ColorSchemeName): ColorPalette => {
  return colorScheme === 'dark' ? darkColors : lightColors;
};
