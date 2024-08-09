import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {changeLanguage} from '@utils/i18n'; // Import the changeLanguage function
import {useTheme} from '@utils/ThemeContext';
import {useTranslation} from 'react-i18next';

const Language = () => {
  const {colors} = useTheme();
  const {i18n} = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    languageItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    languageName: {
      fontSize: 18,
      color: colors.text,
      flex: 1,
    },
    selectedIcon: {
      color: colors.primary,
    },
  });

  const languages = [
    {id: '1', name: 'English', code: 'en'},
    {id: '2', name: 'Türkçe', code: 'tr'},
    // Add more languages as needed
  ];

  const handleLanguageChange = async langCode => {
    setSelectedLanguage(langCode);
    await changeLanguage(langCode);
  };

  const renderLanguageItem = ({item}) => (
    <TouchableOpacity
      style={styles.languageItem}
      onPress={() => handleLanguageChange(item.code)}>
      <Text style={styles.languageName}>{item.name}</Text>
      {selectedLanguage === item.code && (
        <Icon name="check" size={24} style={styles.selectedIcon} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={languages}
        renderItem={renderLanguageItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default Language;
