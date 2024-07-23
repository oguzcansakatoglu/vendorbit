// palette.ts

import {ColorSchemeName} from 'react-native';

const lightColors = {
  primary: '#9498db',
  secondary: '#2ecc71',
  accent: '#e74c3c',
  background: '#f5f5f5',
  surface: '#ffffff',
  text: '#333333',
  textSecondary: '#7f8c8d',
  border: '#bdc3c7',
};

const darkColors = {
  primary: '#0980b9',
  secondary: '#27ae60',
  accent: '#c0392b',
  background: '#2c3e50',
  surface: '#34495e',
  text: '#ecf0f1',
  textSecondary: '#bdc3c7',
  border: '#7f8c8d',
};

export type ColorPalette = typeof lightColors;

export const getColors = (colorScheme: ColorSchemeName): ColorPalette => {
  return colorScheme === 'dark' ? darkColors : lightColors;
};
