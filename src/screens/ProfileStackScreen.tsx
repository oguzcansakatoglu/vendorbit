import {Addresses, Language, Profile} from '@components/index';

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme} from '@utils/ThemeContext';
import {useTranslation} from 'react-i18next';

const ProfileStack = createStackNavigator();

function ProfileStackScreen() {
  const {colors} = useTheme();
  const {t} = useTranslation();

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
      <ProfileStack.Screen
        name="Language"
        component={Language}
        options={{
          title: t('language'),
        }}
      />
      {/* Other screens in the Profile stack */}
    </ProfileStack.Navigator>
  );
}

export default ProfileStackScreen;
