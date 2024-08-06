/* eslint-disable react/react-in-jsx-scope */
import {AddVendor, VendorDetail, VendorPage} from '@components/index';

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme} from '@utils/ThemeContext';

const Stack = createStackNavigator();


function VendorStack() {
  const {colors} = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="Vendors" component={VendorPage} />
      <Stack.Screen name="AddVendor" component={AddVendor} />
      <Stack.Screen name="VendorDetail" component={VendorDetail} />
    </Stack.Navigator>
  );
}

export default VendorStack;
