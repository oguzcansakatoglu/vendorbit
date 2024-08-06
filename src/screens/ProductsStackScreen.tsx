import {AddProduct, EditProduct, ProductsPage} from '@components/index';

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme} from '@utils/ThemeContext';

const Stack = createStackNavigator();

const ProductsStackScreen = () => {
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
        name="ProductsList"
        component={ProductsPage}
        options={{title: 'Products'}}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProduct}
        options={{title: 'Add Product'}}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProduct}
        options={{title: 'Edit Product'}}
      />
    </Stack.Navigator>
  );
};

export default ProductsStackScreen;
