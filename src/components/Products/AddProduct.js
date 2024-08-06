import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';

import firestore from '@react-native-firebase/firestore';
import {useTheme} from '@utils/ThemeContext';

const AddProduct = ({navigation}) => {
  const {colors} = useTheme();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const handleAddProduct = async () => {
    if (!name || !price) {
      Alert.alert('Error', 'Name and price are required');
      return;
    }

    try {
      await firestore()
        .collection('Products')
        .add({
          name,
          price: parseFloat(price),
          description,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      Alert.alert('Success', 'Product added successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, {backgroundColor: colors.background}]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, {color: colors.text}]}>
          Add New Product
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            },
          ]}
          placeholder="Product Name"
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            },
          ]}
          placeholder="Price"
          placeholderTextColor={colors.textSecondary}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={[
            styles.input,
            styles.multilineInput,
            {
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            },
          ]}
          placeholder="Description"
          placeholderTextColor={colors.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.primary}]}
          onPress={handleAddProduct}>
          <Text style={[styles.buttonText, {color: colors.background}]}>
            Add Product
          </Text>
        </TouchableOpacity>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default AddProduct;
