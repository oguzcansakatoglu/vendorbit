import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Icon, Input, ListItem, Text} from 'react-native-elements';
import React, {useEffect, useState} from 'react';

import firestore from '@react-native-firebase/firestore';
import {useTheme} from '@utils/ThemeContext';
import {useTranslation} from 'react-i18next';

const CreateOrder = ({navigation}) => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCustomerModalVisible, setIsCustomerModalVisible] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await firestore().collection('Products').get();
        const productList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          quantity: 0,
        }));
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products: ', error);
        Alert.alert(t('Error'), t('Failed to fetch products'));
      }
    };

    const fetchCustomers = async () => {
      try {
        const snapshot = await firestore().collection('Vendors').get();
        const customerList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCustomers(customerList);
      } catch (error) {
        console.error('Error fetching customers: ', error);
        Alert.alert(t('Error'), t('Failed to fetch customers'));
      }
    };

    fetchProducts();
    fetchCustomers();
  }, [t]);

  const handleQuantityChange = (id, quantity) => {
    const updatedProducts = products.map(product =>
      product.id === id
        ? {...product, quantity: parseInt(quantity) || 0}
        : product,
    );
    setProducts(updatedProducts);
    setSelectedProducts(
      updatedProducts.filter(product => product.quantity > 0),
    );
  };

  const calculateTotal = () => {
    return selectedProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    );
  };

  const handleCreateOrder = async () => {
    if (selectedProducts.length === 0 || !selectedCustomer) {
      Alert.alert(
        t('Error'),
        t('Please select at least one product and choose a customer'),
      );
      return;
    }

    try {
      const orderNumber = await generateOrderNumber();
      await firestore().collection('Orders').add({
        orderNumber,
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.companyName,
        products: selectedProducts,
        total: calculateTotal(),
        status: 'Pending',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert(t('Success'), t('Order created successfully'));
      navigation.goBack();
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert(t('Error'), t('Failed to create order'));
    }
  };

  const generateOrderNumber = async () => {
    const orderCounterDoc = await firestore()
      .collection('Counters')
      .doc('orderCounter')
      .get();
    const currentCounter = orderCounterDoc.exists
      ? orderCounterDoc.data().value
      : 0;
    const newCounter = currentCounter + 1;
    await firestore()
      .collection('Counters')
      .doc('orderCounter')
      .set({value: newCounter});
    return `ORD-${newCounter.toString().padStart(5, '0')}`;
  };

  const handleCreateCustomer = async () => {
    if (!newCustomerName.trim()) {
      Alert.alert(t('Error'), t('Please enter a customer name'));
      return;
    }

    try {
      const newCustomerRef = await firestore().collection('Vendors').add({
        companyName: newCustomerName.trim(),
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      const newCustomer = {
        id: newCustomerRef.id,
        companyName: newCustomerName.trim(),
      };
      setCustomers([...customers, newCustomer]);
      setSelectedCustomer(newCustomer);
      setIsCustomerModalVisible(false);
      setNewCustomerName('');
    } catch (error) {
      console.error('Error creating customer:', error);
      Alert.alert(t('Error'), t('Failed to create customer'));
    }
  };

  const renderProductItem = ({item}) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>${item.price}</ListItem.Subtitle>
      </ListItem.Content>
      <Input
        containerStyle={styles.quantityInputContainer}
        inputStyle={styles.quantityInput}
        keyboardType="numeric"
        value={item.quantity.toString()}
        onChangeText={text => handleQuantityChange(item.id, text)}
      />
    </ListItem>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView>
        <Button
          title={
            selectedCustomer
              ? selectedCustomer.companyName
              : t('Select Customer')
          }
          onPress={() => setIsCustomerModalVisible(true)}
          buttonStyle={styles.customerSelector}
          icon={
            <Icon
              name="user"
              type="font-awesome-5"
              color={colors.primary}
              containerStyle={{marginRight: 10}}
            />
          }
        />
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
        <Text h4 style={styles.total}>
          {t('Total')}: ${calculateTotal().toFixed(2)}
        </Text>
        <Button
          title={t('Create Order')}
          onPress={handleCreateOrder}
          buttonStyle={[styles.createButton, {backgroundColor: colors.primary}]}
          icon={
            <Icon
              name="plus-circle"
              type="font-awesome-5"
              color="white"
              containerStyle={{marginRight: 10}}
            />
          }
        />
      </ScrollView>

      <Modal
        visible={isCustomerModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCustomerModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={customers}
              renderItem={({item}) => (
                <ListItem
                  bottomDivider
                  onPress={() => {
                    setSelectedCustomer(item);
                    setIsCustomerModalVisible(false);
                  }}>
                  <ListItem.Content>
                    <ListItem.Title>{item.companyName}</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              )}
              keyExtractor={item => item.id}
            />
            <Input
              placeholder={t('New Customer Name')}
              value={newCustomerName}
              onChangeText={setNewCustomerName}
              containerStyle={styles.newCustomerInput}
            />
            <Button
              title={t('Create Customer')}
              onPress={handleCreateCustomer}
              buttonStyle={[
                styles.createButton,
                {backgroundColor: colors.primary},
              ]}
            />
            <Button
              title={t('Close')}
              onPress={() => setIsCustomerModalVisible(false)}
              buttonStyle={[
                styles.closeButton,
                {backgroundColor: colors.secondary},
              ]}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  customerSelector: {
    marginBottom: 10,
  },
  quantityInputContainer: {
    width: 60,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  quantityInput: {
    textAlign: 'center',
  },
  total: {
    marginVertical: 20,
    textAlign: 'center',
  },
  createButton: {
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  newCustomerInput: {
    marginTop: 20,
  },
  closeButton: {
    marginTop: 10,
  },
});

export default CreateOrder;
