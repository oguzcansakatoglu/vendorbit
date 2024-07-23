import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@utils/ThemeContext';

const Profile = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary,
      padding: 16,
      alignItems: 'center',
    },
    headerText: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 'bold',
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
    editIcon: {
      position: 'absolute',
      top: 16,
      right: 16,
    },
  });

  const MenuItem = ({icon, text, onPress}) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon name={icon} size={24} color={colors.primary} />
      <Text style={styles.menuText}>{text}</Text>
      <Icon
        name="chevron-right"
        size={24}
        color={colors.text}
        style={{marginLeft: 'auto'}}
      />
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
          text="Adreslerim"
          onPress={() => {
            navigation.navigate('Addresses');
            console.log('hello');
          }}
        />
        <MenuItem icon="favorite" text="Favori İşletmelerim" />
        <MenuItem icon="history" text="Geçmiş Siparişlerim" />
        <MenuItem icon="payment" text="Ödeme Yöntemlerim" />
        <MenuItem icon="receipt" text="Fatura Bilgilerim" />
        <MenuItem icon="notifications" text="İletişim Tercihleri" />
      </ScrollView>
    </View>
  );
};

export default Profile;
