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

const VendorDetail = ({route, navigation}) => {
  const {vendorId} = route.params;
  const [vendor, setVendor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedVendor, setEditedVendor] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState('');
  const {colors, isDark} = useTheme();

  useEffect(() => {
    const fetchVendorAndOrders = async () => {
      if (!auth().currentUser) {
        Alert.alert('Error', 'You must be logged in to view this page');
        navigation.goBack();
        return;
      }

      try {
        const vendorDoc = await firestore()
          .collection('Vendors')
          .doc(vendorId)
          .get();
        if (vendorDoc.exists) {
          const vendorData = vendorDoc.data();
          setVendor(vendorData);
          setEditedVendor(vendorData);

          const ordersSnapshot = await firestore()
            .collection('Orders')
            .where('customerId', '==', vendorId)
            .orderBy('createdAt', 'asc') // Order from oldest to newest
            .get();

          const ordersData = ordersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            remainingAmount: doc.data().total - (doc.data().paidAmount || 0),
          }));

          setOrders(ordersData);
        } else {
          Alert.alert('Error', 'Vendor not found');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error fetching vendor and orders:', error);
        Alert.alert('Error', 'Failed to fetch vendor details and orders');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorAndOrders();
  }, [vendorId, navigation]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      await firestore()
        .collection('Vendors')
        .doc(vendorId)
        .update(editedVendor);
      setVendor(editedVendor);
      setIsEditing(false);
      Alert.alert('Success', 'Vendor updated successfully');
    } catch (error) {
      console.error('Error updating vendor:', error);
      Alert.alert('Error', 'Failed to update vendor');
    }
  };

  const handleCancel = () => {
    setEditedVendor(vendor);
    setIsEditing(false);
  };

  const calculateTotals = () => {
    let totalOrders = orders.length;
    let totalAmount = orders.reduce((sum, order) => sum + order.total, 0);
    let dueAmount = orders.reduce(
      (sum, order) => sum + order.remainingAmount,
      0,
    );
    return {totalOrders, totalAmount, dueAmount};
  };

  const handleProcessPayment = async () => {
    if (
      !paymentAmount ||
      isNaN(paymentAmount) ||
      parseFloat(paymentAmount) <= 0
    ) {
      Alert.alert('Error', 'Please enter a valid payment amount');
      return;
    }

    if (!auth().currentUser) {
      Alert.alert('Error', 'You must be logged in to process payments');
      return;
    }

    let remainingPayment = parseFloat(paymentAmount);
    let updatedOrders = [...orders]; // Create a copy of the orders array

    try {
      const batch = firestore().batch();

      for (let i = 0; i < updatedOrders.length; i++) {
        let order = {...updatedOrders[i]}; // Create a copy of the order object
        if (order.remainingAmount > 0 && remainingPayment > 0) {
          const paymentForThisOrder = Math.min(
            remainingPayment,
            order.remainingAmount,
          );
          const newPaidAmount = (order.paidAmount || 0) + paymentForThisOrder;
          const newRemainingAmount = order.total - newPaidAmount;
          const newStatus = newRemainingAmount <= 0 ? 'Paid' : 'Partially Paid';

          const orderRef = firestore().collection('Orders').doc(order.id);
          batch.update(orderRef, {
            status: newStatus,
            paidAmount: newPaidAmount,
            lastPaymentDate: firestore.FieldValue.serverTimestamp(),
          });

          order = {
            ...order,
            paidAmount: newPaidAmount,
            remainingAmount: newRemainingAmount,
            status: newStatus,
          };
          updatedOrders[i] = order; // Update the order in the array

          remainingPayment -= paymentForThisOrder;
        }

        if (remainingPayment <= 0) break;
      }

      await batch.commit();

      setOrders(updatedOrders);
      setPaymentAmount('');

      if (remainingPayment > 0) {
        Alert.alert(
          'Success',
          `Payment processed successfully. Overpayment of $${remainingPayment.toFixed(
            2,
          )} was not applied.`,
        );
      } else {
        Alert.alert('Success', 'Payment processed successfully');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      let errorMessage = 'Failed to process payment';
      if (error.code === 'firestore/permission-denied') {
        errorMessage =
          'You do not have permission to process payments. Please check your account permissions.';
      }
      Alert.alert('Error', errorMessage);
    }
  };

  const renderOrderItem = ({item}) => (
    <View
      style={[
        styles.orderItem,
        {backgroundColor: colors.card, borderColor: colors.border},
      ]}>
      <Text style={[styles.orderNumber, {color: colors.text}]}>
        Order #{item.orderNumber}
      </Text>
      <Text style={{color: colors.text}}>Total: ${item.total.toFixed(2)}</Text>
      <Text style={{color: colors.text}}>
        Remaining: ${item.remainingAmount.toFixed(2)}
      </Text>
      <Text style={{color: colors.text}}>Status: {item.status}</Text>
      <Text style={{color: colors.text}}>
        Date: {item.createdAt.toDate().toLocaleDateString()}
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

  const {totalOrders, totalAmount, dueAmount} = calculateTotals();

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <ScrollView>
        <Text style={[styles.title, {color: colors.text}]}>
          {isEditing ? 'Edit Vendor' : 'Vendor Details'}
        </Text>

        <View style={styles.field}>
          <Text style={[styles.label, {color: colors.text}]}>Name:</Text>
          {isEditing ? (
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              value={editedVendor.name}
              onChangeText={text =>
                setEditedVendor({...editedVendor, name: text})
              }
            />
          ) : (
            <Text style={[styles.value, {color: colors.text}]}>
              {vendor.name}
            </Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, {color: colors.text}]}>
            Contact Person:
          </Text>
          {isEditing ? (
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              value={editedVendor.contactPerson}
              onChangeText={text =>
                setEditedVendor({...editedVendor, contactPerson: text})
              }
            />
          ) : (
            <Text style={[styles.value, {color: colors.text}]}>
              {vendor.contactPerson}
            </Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, {color: colors.text}]}>Email:</Text>
          {isEditing ? (
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              value={editedVendor.email}
              onChangeText={text =>
                setEditedVendor({...editedVendor, email: text})
              }
              keyboardType="email-address"
            />
          ) : (
            <Text style={[styles.value, {color: colors.text}]}>
              {vendor.email}
            </Text>
          )}
        </View>

        {!isEditing && (
          <>
            <View
              style={[styles.totalsContainer, {backgroundColor: colors.card}]}>
              <Text style={[styles.totalsTitle, {color: colors.text}]}>
                Order Summary
              </Text>
              <Text style={{color: colors.text}}>
                Total Orders: {totalOrders}
              </Text>
              <Text style={{color: colors.text}}>
                Total Amount: ${totalAmount.toFixed(2)}
              </Text>
              <Text style={{color: colors.text}}>
                Due Amount: ${dueAmount.toFixed(2)}
              </Text>
            </View>

            <Text style={[styles.recentOrdersTitle, {color: colors.text}]}>
              Orders
            </Text>
            <FlatList
              data={orders}
              renderItem={renderOrderItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </>
        )}

        {isEditing ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: colors.primary}]}
              onPress={handleSave}>
              <Text style={[styles.buttonText, {color: colors.buttonText}]}>
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: colors.accent}]}
              onPress={handleCancel}>
              <Text style={[styles.buttonText, {color: colors.buttonText}]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, {backgroundColor: colors.primary}]}
            onPress={handleEdit}>
            <Text style={[styles.buttonText, {color: colors.text}]}>Edit</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {!isEditing && (
        <View
          style={[
            styles.paymentContainer,
            {backgroundColor: colors.card, borderColor: colors.border},
          ]}>
          <TextInput
            style={[
              styles.paymentInput,
              {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.background,
              },
            ]}
            keyboardType="numeric"
            placeholder="Enter payment amount"
            placeholderTextColor={colors.textSecondary}
            value={paymentAmount}
            onChangeText={setPaymentAmount}
          />
          <TouchableOpacity
            style={[styles.button, {backgroundColor: colors.primary}]}
            onPress={handleProcessPayment}>
            <Text style={[styles.buttonText, {color: colors.text}]}>
              Process Payment
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  totalsContainer: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 20,
  },
  totalsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recentOrdersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderItem: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
  },
  orderNumber: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  paymentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  paymentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});

export default VendorDetail;
