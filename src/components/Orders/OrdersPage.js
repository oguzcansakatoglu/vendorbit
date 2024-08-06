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

import firestore from '@react-native-firebase/firestore';
import {useTheme} from '@utils/ThemeContext';

const OrdersPage = ({navigation}) => {
  const {colors} = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(() => {
    const unsubscribe = firestore()
      .collection('Orders')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        querySnapshot => {
          const orderList = [];
          querySnapshot.forEach(doc => {
            orderList.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setOrders(orderList);
          setLoading(false);
          setRefreshing(false);
        },
        error => {
          console.error('Error fetching orders: ', error);
          Alert.alert('Error', 'Failed to fetch orders');
          setLoading(false);
          setRefreshing(false);
        },
      );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = fetchOrders();
    return () => unsubscribe();
  }, [fetchOrders]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, [fetchOrders]);

  const renderOrderItem = ({item}) => (
    <TouchableOpacity
      style={[styles.orderItem, {borderBottomColor: colors.border}]}
      onPress={() => navigation.navigate('OrderDetail', {orderId: item.id})}>
      <Text style={[styles.orderNumber, {color: colors.text}]}>
        Order #{item.orderNumber}
      </Text>
      <Text style={{color: colors.textSecondary}}>
        Customer: {item.customerName}
      </Text>
      <Text style={{color: colors.textSecondary}}>
        Total: ${item.total.toFixed(2)}
      </Text>
      <Text style={[styles.statusText, {color: getStatusColor(item.status)}]}>
        Status: {item.status}
      </Text>
    </TouchableOpacity>
  );

  const getStatusColor = status => {
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
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <TouchableOpacity
        style={[styles.createButton, {backgroundColor: colors.primary}]}
        onPress={() => navigation.navigate('CreateOrder')}>
        <Text style={[styles.createButtonText, {color: colors.text}]}>
          Create New Order
        </Text>
      </TouchableOpacity>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
            No orders found. Pull down to refresh.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  createButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orderItem: {
    padding: 15,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
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
});

export default OrdersPage;
