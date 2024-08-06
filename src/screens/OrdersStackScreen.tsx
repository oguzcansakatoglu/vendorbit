import {CreateOrder, OrderDetail, OrdersPage} from '@components/index';

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme} from '@utils/ThemeContext';

const Stack = createStackNavigator();

const OrdersStackScreen = () => {
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
      <Stack.Screen
        name="OrdersList"
        component={OrdersPage}
        options={{title: 'Orders'}}
      />
      <Stack.Screen
        name="CreateOrder"
        component={CreateOrder}
        options={{title: 'Create Order'}}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{title: 'Order Details'}}
      />
    </Stack.Navigator>
  );
};

export default OrdersStackScreen;
