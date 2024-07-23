import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {useTheme} from '@utils/ThemeContext';

const Addresses = () => {
  const {colors} = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    addressItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    addressTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    addressDetails: {
      fontSize: 14,
      color: colors.text,
      marginTop: 4,
    },
    addButton: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      backgroundColor: colors.primary,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
  });

  const addresses = [
    {id: '1', title: 'Ev', details: 'Ataşehir, İstanbul'},
    {id: '2', title: 'İş', details: 'Maslak, İstanbul'},
    // Add more addresses as needed
  ];

  const renderAddressItem = ({item}) => (
    <TouchableOpacity style={styles.addressItem}>
      <Text style={styles.addressTitle}>{item.title}</Text>
      <Text style={styles.addressDetails}>{item.details}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={addresses}
        renderItem={renderAddressItem}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity style={styles.addButton}>
        <Icon name="add" size={24} color={colors.background} />
      </TouchableOpacity>
    </View>
  );
};

export default Addresses;
