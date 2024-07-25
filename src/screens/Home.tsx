/* eslint-disable react/no-unstable-nested-components */
import {Button, Switch, Text, View} from 'react-native';
import React, {useState} from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {Modal} from '@components/index';
import {ProfileStackScreen} from '@screens/index';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {useTheme} from '@utils/ThemeContext';
import {useTranslation} from 'react-i18next';

const Tab = createBottomTabNavigator();
const Test = () => {
  const {colors} = useTheme();

  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  return (
    <View style={[{backgroundColor: colors.background, height: '100%'}]}>
      <Ionicons name="ios-home-outline" size={20} />
      <Button title="Modal" onPress={() => setVisible(true)} />
      <Modal
        isVisible={visible}
        loading={loading}
        title={'title'}
        onClose={() => setVisible(false)}
        onConfirm={() => {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            setVisible(false);
          }, 2000);
        }}
        confirmButton={t('confirm')}
        children={
          <View>
            <Text>hello</Text>
          </View>
        }
      />
    </View>
  );
};

export type BottomTabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

function Home() {
  const {isDarkMode, toggleTheme, colors} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: (route => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';

          if (['Addresses', 'Language']?.includes(routeName)) {
            return {display: 'none'};
          }
          return {
            backgroundColor: colors.primary,
          };
        })(route),
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'business' : 'business-outline';
              break;
            case 'ProfileStack':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Settings':
              iconName = focused ? 'compass' : 'compass-outline';
              break;
            default:
              iconName = 'help-circle';
          }

          return (
            <View>
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'black',
        tabBarLabel: () => null,
      })}>
      <Tab.Screen
        name="Home"
        component={Test}
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
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen name="Settings" component={Test} />
    </Tab.Navigator>
  );
}

export default Home;
