import {Home, LoginScreen, SignupScreen, WelcomeScreen} from '@screens/index';
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Switch, Text, View} from 'react-native';
import {ThemeProvider, useTheme} from '@utils/ThemeContext';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {I18nextProvider} from 'react-i18next';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createStackNavigator} from '@react-navigation/stack';
import i18n from '@utils/i18n';

const Stack = createStackNavigator();

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Main: undefined;
};

function MainApp(): React.JSX.Element {
  const {isDarkMode, toggleTheme, colors} = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to handle successful authentication
  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

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
        {isAuthenticated ? (
          <Stack.Screen
            name="Main"
            component={Home}
            options={{headerShown: false}}
          />
        ) : (
          <>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{
                // eslint-disable-next-line react/no-unstable-nested-components
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
            <Stack.Screen name="Login">
              {props => (
                <LoginScreen {...props} onLogin={handleAuthentication} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Signup">
              {(props: any) => (
                <SignupScreen {...props} onSignup={handleAuthentication} />
              )}
            </Stack.Screen>
          </>
        )}
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
