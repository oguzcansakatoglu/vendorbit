import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '../translations/en.json';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import tr from '../translations/tr.json';

const LANGUAGE_STORAGE_KEY = '@app_language';

const resources = {
  en: {translation: en},
  tr: {translation: tr},
};

const getStoredLanguage = async () => {
  try {
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    return storedLanguage || 'tr'; // Default to 'tr' if no language is stored
  } catch (error) {
    console.error('Error reading stored language:', error);
    return 'tr'; // Default to 'tr' in case of error
  }
};

const initI18n = async () => {
  const storedLanguage = await getStoredLanguage();

  i18n.use(initReactI18next).init({
    resources,
    lng: storedLanguage,
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export const changeLanguage = async (lang: any) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    await i18n.changeLanguage(lang);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

export default i18n;
