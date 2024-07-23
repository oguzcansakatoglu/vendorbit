import 'react-native-gesture-handler';
// Add these imports for i18n support
import '@formatjs/intl-getcanonicallocales/polyfill';
import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-relativetimeformat/polyfill';
// Import your i18n configuration
import './src/utils/i18n';

import {AppRegistry, Platform} from 'react-native';

import App from './App';
import {name as appName} from './app.json';

if (Platform.OS === 'android') {
  // See https://github.com/expo/expo/issues/6536 for this issue.
  if (typeof Intl.__disableRegExpRestore === 'function') {
    Intl.__disableRegExpRestore();
  }
}

AppRegistry.registerComponent(appName, () => App);
