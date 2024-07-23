import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '@utils/ThemeContext';

const Language = () => {
  const {colors} = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('English');

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
    {id: '1', name: 'English'},
    {id: '2', name: 'Türkçe'},
    {id: '3', name: 'Español'},
    {id: '4', name: 'Français'},
    {id: '5', name: 'Deutsch'},
    {id: '6', name: '日本語'},
    {id: '7', name: '中文'},
    // Add more languages as needed
  ];

  const renderLanguageItem = ({item}) => (
    <TouchableOpacity
      style={styles.languageItem}
      onPress={() => setSelectedLanguage(item.name)}>
      <Text style={styles.languageName}>{item.name}</Text>
      {selectedLanguage === item.name && (
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
