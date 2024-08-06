import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {BottomSlideDialog} from '@components/index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import {useAuth} from '../../contexts/Auth';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@utils/ThemeContext';
import {useTranslation} from 'react-i18next';

const Profile = () => {
  const {colors, isDark, toggleTheme} = useTheme();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {user, signOut} = useAuth();
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const userDoc = await firestore()
          .collection('Users')
          .doc(user.uid)
          .get();
        if (userDoc.exists) {
          setUserProfile(userDoc.data());
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    profileInfo: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      alignItems: 'center',
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 16,
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    email: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 4,
    },
    phone: {
      fontSize: 16,
      color: colors.text,
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
      flex: 1,
    },
    themeSwitch: {
      marginLeft: 'auto',
    },
    logoutText: {
      color: colors.error,
    },
    version: {
      textAlign: 'center',
      marginTop: 20,
      color: colors.textSecondary,
    },
  });

  const handleLogout = () => {
    setLogoutDialogVisible(true);
  };

  const confirmLogout = () => {
    setLogoutDialogVisible(false);
    signOut();
  };

  const MenuItem = ({icon, text, onPress, rightElement, textStyle}) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon name={icon} size={24} color={colors.text} />
      <Text style={[styles.menuText, textStyle]}>{text}</Text>
      {rightElement || (
        <Icon name="chevron-right" size={24} color={colors.text} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <MenuItem
          icon="person"
          text={t('editProfile')}
          onPress={() => navigation.navigate('EditProfile')}
        />
        <MenuItem
          icon="location-on"
          text={t('addresses')}
          onPress={() => navigation.navigate('Addresses')}
        />
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
          icon="lock"
          text={t('changePassword')}
          onPress={() => navigation.navigate('ChangePassword')}
        />
        <MenuItem
          icon="help"
          text={t('help')}
          onPress={() => navigation.navigate('Help')}
        />
        <MenuItem
          icon="info"
          text={t('about')}
          onPress={() => navigation.navigate('About')}
        />
        <MenuItem
          icon="exit-to-app"
          text={t('logout')}
          onPress={handleLogout}
          textStyle={styles.logoutText}
        />
        <Text style={styles.version}>{t('version')} 1.0.0</Text>
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
