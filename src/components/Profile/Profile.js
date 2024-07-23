import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {BottomSlideDialog} from '@components/index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@utils/ThemeContext';
import {useTranslation} from 'react-i18next';

const Profile = () => {
  const {colors, isDark, toggleTheme} = useTheme();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    profileInfo: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      marginRight: 16,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    email: {
      fontSize: 14,
      color: colors.text,
      marginTop: 4,
    },
    phone: {
      fontSize: 14,
      color: colors.text,
      marginTop: 4,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuText: {
      marginLeft: 16,
      fontSize: 16,
      color: colors.text,
    },
    themeSwitch: {
      marginLeft: 'auto',
    },
    logoutText: {
      color: 'red',
    },
  });

  const handleLogout = () => {
    setLogoutDialogVisible(true);
  };

  const confirmLogout = () => {
    setLogoutDialogVisible(false);
    // Implement your logout logic here
    console.log('User logged out');
    // For example, you might clear the auth token and navigate to the login screen:
    // AsyncStorage.removeItem('authToken');
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'Login' }],
    // });
  };

  const MenuItem = ({icon, text, onPress, rightElement, textStyle}) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon name={icon} size={24} color={colors.primary} />
      <Text style={[styles.menuText, textStyle]}>{text}</Text>
      {rightElement ? (
        rightElement
      ) : (
        <Icon
          name="chevron-right"
          size={24}
          color={colors.text}
          style={{marginLeft: 'auto'}}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.profileInfo}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.avatar} />
            <View>
              <Text style={styles.name}>o saka</Text>
              <Text style={styles.email}>sakatogluoguzcan@gmail.com</Text>
              <Text style={styles.phone}>+90 (532) 064-5411</Text>
            </View>
          </View>
        </View>
        <MenuItem
          icon="location-on"
          text={t('addresses')}
          onPress={() => navigation.navigate('Addresses')}
        />
        <MenuItem icon="favorite" text={t('favoriteBusinesses')} />
        <MenuItem icon="history" text={t('orderHistory')} />
        <MenuItem icon="payment" text={t('paymentMethods')} />
        <MenuItem icon="receipt" text={t('invoiceInformation')} />
        <MenuItem
          icon="language"
          text={t('language')}
          onPress={() => navigation.navigate('Language')}
        />
        <MenuItem
          icon="brightness-6"
          text={t('darkMode')}
          rightElement={
            <Switch
              style={styles.themeSwitch}
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{false: colors.border, true: colors.primary}}
              thumbColor={isDark ? colors.background : colors.text}
            />
          }
        />
        <MenuItem
          icon="exit-to-app"
          text={t('logout')}
          onPress={handleLogout}
          textStyle={styles.logoutText}
        />
      </ScrollView>
      <BottomSlideDialog
        visible={logoutDialogVisible}
        title={t('logoutConfirmTitle')}
        message={t('logoutConfirmMessage')}
        onCancel={() => setLogoutDialogVisible(false)}
        onConfirm={confirmLogout}
        cancelText={t('cancel')}
        confirmText={t('logout')}
      />
    </View>
  );
};

export default Profile;
