import {Addresses, Profile} from '@components/index';

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme} from '@utils/ThemeContext';

const ProfileStack = createStackNavigator();

function ProfileStackScreen() {
  const {colors} = useTheme();

  return (
    <ProfileStack.Navigator
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
      <ProfileStack.Screen name="Profile" component={Profile} />
      <ProfileStack.Screen
        name="Addresses"
        component={Addresses}
        options={{
          title: 'Adreslerim',
        }}
      />
      {/* Other screens in the Profile stack */}
    </ProfileStack.Navigator>
  );
}

export default ProfileStackScreen;
