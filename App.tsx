import {Switch, Text, View} from 'react-native';
import {ThemeProvider, useTheme} from '@utils/ThemeContext';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {I18nextProvider} from 'react-i18next';
import LoginScreen from '@screens/LoginScreen';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SignupScreen from '@screens/SignupScreen';
import WelcomeScreen from '@screens/WelcomeScreen';
import {createStackNavigator} from '@react-navigation/stack';
import i18n from '@utils/i18n';

const Stack = createStackNavigator();

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
};

function MainApp(): React.JSX.Element {
  const {isDarkMode, toggleTheme, colors} = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            headerRight: () => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 10,
                }}>
                <Text style={{color: colors.text, marginRight: 5}}>
                  {isDarkMode ? 'Dark' : 'Light'}
                </Text>
                <Switch
                  trackColor={{false: colors.border, true: colors.primary}}
                  thumbColor={isDarkMode ? colors.accent : colors.secondary}
                  onValueChange={toggleTheme}
                  value={isDarkMode}
                />
              </View>
            ),
          }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>
            <MainApp />
          </ThemeProvider>
        </I18nextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
