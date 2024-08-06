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
import React, {useCallback, useEffect, useState} from 'react';

import {ListItem} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@utils/ThemeContext';
import {useTranslation} from 'react-i18next';

const ITEMS_PER_PAGE = 10;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const navigation = useNavigation();
  const {colors} = useTheme();
  const {t} = useTranslation();

  const fetchOrders = useCallback(
    async (lastVisible = null) => {
      try {
        let query = firestore()
          .collection('Orders')
          .orderBy('createdAt', 'desc')
          .limit(ITEMS_PER_PAGE);
        if (lastVisible) {
          query = query.startAfter(lastVisible);
        }

        const ordersSnapshot = await query.get();
        if (ordersSnapshot.empty && !lastVisible) {
          setOrders([]);
          setAllLoaded(true);
          setLoading(false);
          setRefreshing(false);
          return;
        }

        const lastVisible = ordersSnapshot.docs[ordersSnapshot.docs.length - 1];
        setLastDoc(lastVisible);

        const ordersData = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(prevOrders =>
          lastVisible ? [...prevOrders, ...ordersData] : ordersData,
        );
        setAllLoaded(ordersData.length < ITEMS_PER_PAGE);
      } catch (error) {
        console.error('Error fetching orders:', error);
        Alert.alert(t('Error'), t('Failed to fetch orders. Please try again.'));
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [t],
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLastDoc(null);
    setAllLoaded(false);
    fetchOrders();
  }, [fetchOrders]);

  const loadMoreOrders = useCallback(() => {
    if (!allLoaded && !loadingMore) {
      setLoadingMore(true);
      fetchOrders(lastDoc);
    }
  }, [allLoaded, loadingMore, fetchOrders, lastDoc]);

  const getStatusColor = useCallback(
    status => {
      switch (status.toLowerCase()) {
        case 'pending':
          return colors.warning;
        case 'completed':
          return colors.success;
        case 'cancelled':
          return colors.error;
        default:
          return colors.text;
      }
    },
    [colors],
  );

  const renderOrderItem = useCallback(
    ({item}) => (
      <ListItem
        bottomDivider
        onPress={() => navigation.navigate('OrderDetail', {orderId: item.id})}
        containerStyle={[styles.listItem, {backgroundColor: colors.background}]}
        accessible={true}
        accessibilityLabel={`Order #${item.orderNumber}, Customer: ${
          item.customerName
        }, Total: $${item.total.toFixed(2)}, Status: ${item.status}`}>
        <ListItem.Content>
          <ListItem.Title style={[styles.orderNumber, {color: colors.text}]}>
            {t('Order')} #{item.orderNumber}
          </ListItem.Title>
          <ListItem.Subtitle
            style={[styles.orderDetail, {color: colors.textSecondary}]}>
            {t('Customer')}: {item.customerName}
          </ListItem.Subtitle>
          <ListItem.Subtitle
            style={[styles.orderDetail, {color: colors.textSecondary}]}>
            {t('Total')}: ${item.total.toFixed(2)}
          </ListItem.Subtitle>
          <ListItem.Subtitle
            style={[styles.statusText, {color: getStatusColor(item.status)}]}>
            {t('Status')}: {item.status}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    ),
    [colors, navigation, t, getStatusColor],
  );

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
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        onEndReached={loadMoreOrders}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() =>
          loadingMore && (
            <ActivityIndicator size="small" color={colors.primary} />
          )
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
            {t('No orders found. Pull down to refresh.')}
          </Text>
        }
      />
      <TouchableOpacity
        style={[styles.fab, {backgroundColor: colors.text}]}
        onPress={() => navigation.navigate('CreateOrder')}
        accessibilityLabel={t('Create New Order')}>
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
  orderNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  orderDetail: {
    fontSize: 14,
    marginBottom: 2,
  },
  statusText: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
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

export default OrdersPage;
