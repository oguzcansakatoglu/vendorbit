import {
  OrdersStackScreen,
  ProductsStackScreen,
  ProfileStackScreen,
  VendorStackScreen,
} from '@screens/index';

import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
/* eslint-disable react/no-unstable-nested-components */
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {useTheme} from '@utils/ThemeContext';

const Tab = createBottomTabNavigator();

export type BottomTabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

function Home() {
  const {colors} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: (route => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';
          console.log({routeName});
          if (
            [
              'Addresses',
              'Language',
              'CreateOrder',
              'VendorDetail',
              'AddVendor',
            ]?.includes(routeName)
          ) {
            return {display: 'none'};
          }
          return {
            backgroundColor: colors.primary,
          };
        })(route),
        tabBarIcon: ({focused, color, size}) => {
          console.log({color});
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
            case 'Products':
              iconName = focused ? 'cube' : 'cube-outline';
              break;
            case 'OrderStack':
              iconName = focused ? 'cart' : 'cart-outline';
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
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabel: () => null,
      })}>
      <Tab.Screen name="Home" component={VendorStackScreen} />

      <Tab.Screen name="Products" component={ProductsStackScreen} />
      <Tab.Screen name="OrderStack" component={OrdersStackScreen} />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackScreen}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default Home;
