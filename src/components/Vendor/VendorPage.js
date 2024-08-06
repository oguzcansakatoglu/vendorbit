import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Icon, ListItem} from 'react-native-elements';
import React, {useCallback, useEffect, useState} from 'react';

import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@utils/ThemeContext';
import {useTranslation} from 'react-i18next';

const ITEMS_PER_PAGE = 10;

const VendorPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const navigation = useNavigation();
  const {colors} = useTheme();
  const {t} = useTranslation();

  const fetchVendorsAndOrders = useCallback(
    async (lastVisible = null) => {
      try {
        let query = firestore()
          .collection('Vendors')
          .orderBy('companyName')
          .limit(ITEMS_PER_PAGE);
        if (lastVisible) {
          query = query.startAfter(lastVisible);
        }

        const vendorsSnapshot = await query.get();
        if (vendorsSnapshot.empty && !lastVisible) {
          setVendors([]);
          setAllLoaded(true);
          setLoading(false);
          setRefreshing(false);
          return;
        }

        const lastVisible =
          vendorsSnapshot.docs[vendorsSnapshot.docs.length - 1];
        setLastDoc(lastVisible);

        const vendorsData = vendorsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          totalOrders: 0,
          totalAmount: 0,
          dueAmount: 0,
        }));

        const ordersSnapshot = await firestore().collection('Orders').get();
        ordersSnapshot.docs.forEach(doc => {
          const order = doc.data();
          const vendorIndex = vendorsData.findIndex(
            v => v.id === order.customerId,
          );
          if (vendorIndex !== -1) {
            vendorsData[vendorIndex].totalOrders++;
            vendorsData[vendorIndex].totalAmount += order.total;
            const dueForThisOrder =
              order.remainingAmount ?? order.total - (order.paidAmount || 0);
            vendorsData[vendorIndex].dueAmount += Math.max(dueForThisOrder, 0);
          }
        });

        setVendors(prevVendors =>
          lastVisible ? [...prevVendors, ...vendorsData] : vendorsData,
        );
        setAllLoaded(vendorsData.length < ITEMS_PER_PAGE);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert(
          t('Error'),
          t('Failed to fetch vendors. Please try again.'),
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
    fetchVendorsAndOrders();
  }, [fetchVendorsAndOrders]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLastDoc(null);
    setAllLoaded(false);
    fetchVendorsAndOrders();
  }, [fetchVendorsAndOrders]);

  const loadMoreVendors = useCallback(() => {
    if (!allLoaded && !loadingMore) {
      setLoadingMore(true);
      fetchVendorsAndOrders(lastDoc);
    }
  }, [allLoaded, loadingMore, fetchVendorsAndOrders, lastDoc]);

  const renderVendorItem = useCallback(
    ({item}) => (
      <ListItem
        bottomDivider
        onPress={() => navigation.navigate('VendorDetail', {vendorId: item.id})}
        containerStyle={[styles.listItem, {backgroundColor: colors.background}]}
        accessible={true}
        accessibilityLabel={`${item.companyName}, ${t('Total Orders')}: ${
          item.totalOrders
        }, ${t('Total Amount')}: $${item.totalAmount.toFixed(2)}, ${t(
          'Due Amount',
        )}: $${item.dueAmount.toFixed(2)}`}>
        <Icon name="building" type="font-awesome-5" color={colors.text} />
        <ListItem.Content>
          <ListItem.Title style={[styles.vendorName, {color: colors.text}]}>
            {item.companyName}
          </ListItem.Title>
          <ListItem.Subtitle
            style={[styles.vendorDetail, {color: colors.text}]}>
            {t('Total Orders')}: {item.totalOrders}
          </ListItem.Subtitle>
          <ListItem.Subtitle
            style={[styles.vendorDetail, {color: colors.text}]}>
            {t('Total Amount')}: ${item.totalAmount.toFixed(2)}
          </ListItem.Subtitle>
          <ListItem.Subtitle
            style={[
              styles.vendorDetail,
              {color: colors.text, fontWeight: 'bold'},
            ]}>
            {t('Due Amount')}: ${item.dueAmount.toFixed(2)}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    ),
    [colors, navigation, t],
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
      <Button
        title={t('Add New Vendor')}
        onPress={() => navigation.navigate('AddVendor')}
        buttonStyle={[styles.addButton, {backgroundColor: colors.primary}]}
        titleStyle={{color: colors.text}}
        icon={
          <Icon
            name="plus-circle"
            type="font-awesome-5"
            color={colors.text}
            containerStyle={styles.buttonIcon}
          />
        }
        accessible={true}
        accessibilityLabel={t('Add New Vendor')}
      />
      <FlatList
        data={vendors}
        renderItem={renderVendorItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMoreVendors}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() =>
          loadingMore && (
            <ActivityIndicator size="small" color={colors.primary} />
          )
        }
      />
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
  addButton: {
    margin: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  listItem: {
    paddingVertical: 10,
  },
  vendorName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  vendorDetail: {
    fontSize: 14,
    marginBottom: 2,
  },
});

export default VendorPage;
