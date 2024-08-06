import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useTheme} from '@utils/ThemeContext';
import {useTranslation} from 'react-i18next';

const OrderDetail = ({route, navigation}) => {
  const {orderId} = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState('');
  const {t} = useTranslation();
  const {colors} = useTheme();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderDoc = await firestore()
          .collection('Orders')
          .doc(orderId)
          .get();
        if (orderDoc.exists) {
          setOrder({id: orderDoc.id, ...orderDoc.data()});
        } else {
          Alert.alert(t('Error'), t('Order not found'));
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        Alert.alert(t('Error'), t('Failed to fetch order details'));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigation, t]);

  const handleUpdateStatus = async newStatus => {
    if (!auth().currentUser) {
      Alert.alert(
        t('Error'),
        t('You must be logged in to update the order status'),
      );
      return;
    }

    try {
      await firestore()
        .collection('Orders')
        .doc(orderId)
        .update({status: newStatus});
      setOrder({...order, status: newStatus});
      Alert.alert(t('Success'), t('Order status updated'));
    } catch (error) {
      console.error('Error updating order status:', error);
      let errorMessage = t('Failed to update order status');
      if (error.code === 'firestore/permission-denied') {
        errorMessage = t(
          'You do not have permission to update the order status',
        );
      }
      Alert.alert(t('Error'), errorMessage);
    }
  };

  const handleProcessPayment = async () => {
    if (!auth().currentUser) {
      Alert.alert(t('Error'), t('You must be logged in to process payments'));
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert(t('Error'), t('Please enter a valid payment amount'));
      return;
    }

    const remainingAmount = order.total - (order.paidAmount || 0);
    if (amount > remainingAmount) {
      Alert.alert(
        t('Error'),
        t('Payment amount cannot exceed the remaining balance'),
      );
      return;
    }

    try {
      const newPaidAmount = (order.paidAmount || 0) + amount;
      const newStatus =
        newPaidAmount >= order.total ? 'Paid' : 'Partially Paid';
      await firestore().collection('Orders').doc(orderId).update({
        paidAmount: newPaidAmount,
        status: newStatus,
        lastPaymentDate: firestore.FieldValue.serverTimestamp(),
      });
      setOrder({...order, paidAmount: newPaidAmount, status: newStatus});
      setPaymentAmount('');
      Alert.alert(t('Success'), t('Payment processed successfully'));
    } catch (error) {
      console.error('Error processing payment:', error);
      let errorMessage = t('Failed to process payment');
      if (error.code === 'firestore/permission-denied') {
        errorMessage = t('You do not have permission to process payments');
      }
      Alert.alert(t('Error'), errorMessage);
    }
  };

  const renderProductItem = ({item}) => (
    <View style={[styles.productItem, {borderBottomColor: colors.border}]}>
      <Text style={[styles.productName, {color: colors.text}]}>
        {item.name}
      </Text>
      <Text style={{color: colors.textSecondary}}>
        {t('Quantity')}: {item.quantity}
      </Text>
      <Text style={{color: colors.textSecondary}}>
        {t('Price')}: ${item.price.toFixed(2)}
      </Text>
    </View>
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
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <Text style={[styles.orderNumber, {color: colors.text}]}>
        {t('Order')} #{order.orderNumber}
      </Text>
      <Text style={[styles.infoText, {color: colors.text}]}>
        {t('Customer')}: {order.customerName}
      </Text>
      <Text style={[styles.infoText, {color: colors.text}]}>
        {t('Status')}: {t(order.status)}
      </Text>
      <Text style={[styles.infoText, {color: colors.text}]}>
        {t('Total')}: ${order.total.toFixed(2)}
      </Text>
      <Text style={[styles.infoText, {color: colors.text}]}>
        {t('Paid')}: ${(order.paidAmount || 0).toFixed(2)}
      </Text>
      <Text style={[styles.infoText, {color: colors.text}]}>
        {t('Remaining')}: ${(order.total - (order.paidAmount || 0)).toFixed(2)}
      </Text>
      <Text style={[styles.infoText, {color: colors.text}]}>
        {t('Date')}: {order.createdAt.toDate().toLocaleDateString()}
      </Text>

      <Text style={[styles.productsTitle, {color: colors.text}]}>
        {t('Products')}:
      </Text>
      <FlatList
        data={order.products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        scrollEnabled={false}
      />

      <View style={styles.paymentContainer}>
        <TextInput
          style={[
            styles.paymentInput,
            {
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            },
          ]}
          placeholder={t('Enter payment amount')}
          placeholderTextColor={colors.textSecondary}
          value={paymentAmount}
          onChangeText={setPaymentAmount}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.primary}]}
          onPress={handleProcessPayment}>
          <Text style={[styles.buttonText, {color: colors.text}]}>
            {t('Process Payment')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusButtons}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.warning}]}
          onPress={() => handleUpdateStatus('Processing')}>
          <Text style={[styles.buttonText, {color: colors.background}]}>
            {t('Mark as Processing')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.success}]}
          onPress={() => handleUpdateStatus('Completed')}>
          <Text style={[styles.buttonText, {color: colors.background}]}>
            {t('Mark as Completed')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  productsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  productItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  paymentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default OrderDetail;
