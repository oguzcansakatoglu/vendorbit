import {
  ActivityIndicator,
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
import React, {useEffect, useState} from 'react';

import firestore from '@react-native-firebase/firestore';
import {useTheme} from '@utils/ThemeContext';

const EditProduct = ({route, navigation}) => {
  const {colors} = useTheme();
  const {productId} = route.params;
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await firestore()
          .collection('Products')
          .doc(productId)
          .get();
        if (productDoc.exists) {
          const productData = productDoc.data();
          setName(productData.name);
          setPrice(productData.price.toString());
          setDescription(productData.description || '');
        } else {
          Alert.alert('Error', 'Product not found');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        Alert.alert('Error', 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigation]);

  const handleUpdateProduct = async () => {
    if (!name || !price) {
      Alert.alert('Error', 'Name and price are required');
      return;
    }

    setUpdating(true);
    try {
      await firestore()
        .collection('Products')
        .doc(productId)
        .update({
          name,
          price: parseFloat(price),
          description,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      Alert.alert('Success', 'Product updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'Failed to update product');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          {backgroundColor: colors.background},
        ]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, {backgroundColor: colors.background}]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, {color: colors.text}]}>Edit Product</Text>
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
          onPress={handleUpdateProduct}
          disabled={updating}>
          {updating ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={[styles.buttonText, {color: colors.background}]}>
              Update Product
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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

export default EditProduct;
