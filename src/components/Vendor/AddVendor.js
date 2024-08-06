import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Icon, Input, Text} from 'react-native-elements';
import React, {useState} from 'react';

import firestore from '@react-native-firebase/firestore';
import {useTheme} from '@utils/ThemeContext';
import {useTranslation} from 'react-i18next';

const AddVendor = ({navigation}) => {
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [taxOffice, setTaxOffice] = useState('');
  const [taxId, setTaxId] = useState('');
  const [phone, setPhone] = useState('');
  const [mail, setMail] = useState('');
  const {colors} = useTheme();
  const {t} = useTranslation();

  const handleAddVendor = async () => {
    if (!companyName.trim()) {
      Alert.alert(t('Error'), t('Company Name is required'));
      return;
    }

    try {
      await firestore().collection('Vendors').add({
        companyName,
        address,
        taxOffice,
        taxId,
        phone,
        mail,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert(t('Success'), t('Vendor added successfully'));
      navigation.goBack();
    } catch (error) {
      console.error('Error adding vendor: ', error);
      Alert.alert(t('Error'), t('Failed to add vendor. Please try again.'));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {backgroundColor: colors.background},
        ]}>
        <Input
          placeholder={t('Company Name')}
          value={companyName}
          style={{color: colors.text}}
          onChangeText={setCompanyName}
          leftIcon={
            <Icon
              name="building"
              type="font-awesome-5"
              color={colors.primary}
            />
          }
        />
        <Input
          placeholder={t('Address')}
          value={address}
          onChangeText={setAddress}
          multiline
          leftIcon={
            <Icon
              name="map-marker-alt"
              type="font-awesome-5"
              color={colors.primary}
            />
          }
        />
        <Input
          placeholder={t('Tax Office')}
          value={taxOffice}
          onChangeText={setTaxOffice}
          leftIcon={
            <Icon
              name="landmark"
              type="font-awesome-5"
              color={colors.primary}
            />
          }
        />
        <Input
          placeholder={t('Tax ID')}
          value={taxId}
          onChangeText={setTaxId}
          leftIcon={
            <Icon name="id-card" type="font-awesome-5" color={colors.primary} />
          }
        />
        <Input
          placeholder={t('Phone')}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          leftIcon={
            <Icon name="phone" type="font-awesome-5" color={colors.primary} />
          }
        />
        <Input
          placeholder={t('Email')}
          value={mail}
          onChangeText={setMail}
          keyboardType="email-address"
          leftIcon={
            <Icon
              name="envelope"
              type="font-awesome-5"
              color={colors.primary}
            />
          }
        />

        <Button
          title={t('Add Vendor')}
          onPress={handleAddVendor}
          buttonStyle={[styles.button, {backgroundColor: colors.text}]}
          // title
          titleStyle={{color: colors.background}}
          icon={
            <Icon
              name="plus-circle"
              type="font-awesome-5"
              color={colors.background}
              containerStyle={{marginRight: 10}}
            />
          }
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    padding: 15,
  },
});

export default AddVendor;
