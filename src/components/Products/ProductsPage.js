import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import firestore from '@react-native-firebase/firestore';
import {useTheme} from '@utils/ThemeContext';

const ProductsPage = ({navigation}) => {
  const {colors} = useTheme();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Products')
      .onSnapshot(
        querySnapshot => {
          const productList = [];
          querySnapshot.forEach(doc => {
            productList.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setProducts(productList);
        },
        error => {
          console.error('Error fetching products: ', error);
          Alert.alert('Error', 'Failed to fetch products');
        },
      );

    return () => unsubscribe();
  }, []);

  const handleDeleteProduct = productId => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => deleteProduct(productId),
        },
      ],
    );
  };

  const deleteProduct = async productId => {
    try {
      await firestore().collection('Products').doc(productId).delete();
      Alert.alert('Success', 'Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      Alert.alert('Error', 'Failed to delete product');
    }
  };

  const renderProductItem = ({item}) => (
    <View style={[styles.productItem, {borderBottomColor: colors.border}]}>
      <Text style={[styles.productName, {color: colors.text}]}>
        {item.name}
      </Text>
      <Text style={{color: colors.textSecondary}}>Price: ${item.price}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.editButton,
            {backgroundColor: colors.secondary},
          ]}
          onPress={() =>
            navigation.navigate('EditProduct', {productId: item.id})
          }>
          <Text style={[styles.buttonText, {color: colors.text}]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            styles.deleteButton,
            {backgroundColor: colors.error},
          ]}
          onPress={() => handleDeleteProduct(item.id)}>
          <Text style={[styles.buttonText, {color: colors.text}]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <TouchableOpacity
        style={[styles.addButton, {backgroundColor: colors.accent}]}
        onPress={() => navigation.navigate('AddProduct')}>
        <Text style={[styles.addButtonText, {color: colors.text}]}>
          Add New Product
        </Text>
      </TouchableOpacity>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  productItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButton: {},
  deleteButton: {},
  buttonText: {},
  addButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ProductsPage;
