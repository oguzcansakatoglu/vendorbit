import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import React, {useCallback, useEffect, useState} from 'react';

import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@utils/ThemeContext';
import {useTranslation} from 'react-i18next';

const ITEMS_PER_PAGE = 10;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const navigation = useNavigation();
  const {colors} = useTheme();
  const {t} = useTranslation();

  const fetchProducts = useCallback(
    async (lastVisible = null) => {
      try {
        let query = firestore()
          .collection('Products')
          .orderBy('name')
          .limit(ITEMS_PER_PAGE);
        if (lastVisible) {
          query = query.startAfter(lastVisible);
        }

        const productsSnapshot = await query.get();
        if (productsSnapshot.empty && !lastVisible) {
          setProducts([]);
          setAllLoaded(true);
          setLoading(false);
          setRefreshing(false);
          return;
        }

        const lastVisible =
          productsSnapshot.docs[productsSnapshot.docs.length - 1];
        setLastDoc(lastVisible);

        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(prevProducts =>
          lastVisible ? [...prevProducts, ...productsData] : productsData,
        );
        setAllLoaded(productsData.length < ITEMS_PER_PAGE);
      } catch (error) {
        console.error('Error fetching products:', error);
        Alert.alert(
          t('Error'),
          t('Failed to fetch products. Please try again.'),
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [t],
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLastDoc(null);
    setAllLoaded(false);
    fetchProducts();
  }, [fetchProducts]);

  const loadMoreProducts = useCallback(() => {
    if (!allLoaded && !loadingMore) {
      setLoadingMore(true);
      fetchProducts(lastDoc);
    }
  }, [allLoaded, loadingMore, fetchProducts, lastDoc]);

  const handleDeleteProduct = useCallback(
    productId => {
      Alert.alert(
        t('Delete Product'),
        t('Are you sure you want to delete this product?'),
        [
          {
            text: t('Cancel'),
            style: 'cancel',
          },
          {
            text: t('OK'),
            onPress: async () => {
              try {
                await firestore()
                  .collection('Products')
                  .doc(productId)
                  .delete();
                Alert.alert(t('Success'), t('Product deleted successfully'));
                onRefresh();
              } catch (error) {
                console.error('Error deleting product:', error);
                Alert.alert(t('Error'), t('Failed to delete product'));
              }
            },
          },
        ],
      );
    },
    [t, onRefresh],
  );

  const renderProductItem = useCallback(
    ({item}) => (
      <ListItem
        bottomDivider
        containerStyle={[styles.listItem, {backgroundColor: colors.background}]}
        accessible={true}
        accessibilityLabel={`${item.name}, ${t('Price')}: $${item.price}`}>
        <Icon name="box" type="font-awesome-5" color={colors.text} />
        <ListItem.Content>
          <ListItem.Title style={[styles.productName, {color: colors.text}]}>
            {item.name}
          </ListItem.Title>
          <ListItem.Subtitle
            style={[styles.productDetail, {color: colors.text}]}>
            {t('Price')}: ${item.price}
          </ListItem.Subtitle>
        </ListItem.Content>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EditProduct', {productId: item.id})
          }
          style={[
            styles.button,
            styles.editButton,
            {backgroundColor: colors.secondary},
          ]}>
          <Text style={[styles.buttonText, {color: colors.text}]}>
            {t('Edit')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteProduct(item.id)}
          style={[
            styles.button,
            styles.deleteButton,
            {backgroundColor: colors.error},
          ]}>
          <Text style={[styles.buttonText, {color: colors.text}]}>
            {t('Delete')}
          </Text>
        </TouchableOpacity>
      </ListItem>
    ),
    [colors, navigation, t, handleDeleteProduct],
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() =>
          loadingMore && (
            <ActivityIndicator size="small" color={colors.primary} />
          )
        }
      />
      <TouchableOpacity
        style={[styles.fab, {backgroundColor: colors.text}]}
        onPress={() => navigation.navigate('AddProduct')}
        accessibilityLabel={t('Add New Product')}>
        <Text
          style={[
            styles.fabText,
            {
              color: colors.background,
            },
          ]}>
          +
        </Text>
      </TouchableOpacity>
    </View>
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
  listItem: {
    paddingVertical: 10,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  productDetail: {
    fontSize: 14,
    marginBottom: 2,
  },
  button: {
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButton: {},
  deleteButton: {},
  buttonText: {
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    borderRadius: 28,
    elevation: 8,
  },
  fabText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ProductsPage;
