import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {ActivityIndicator} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import React from 'react';

export default function CustomModal({
  isVisible,
  onClose,
  loading,
  title,
  onConfirm,
  children,
  confirmButton,
}) {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.headerButtonLeft}>
            <Ionicons name="close" size={24} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{title}</Text>
          <View style={styles.headerButtonRight}>
            {loading ? (
              <ActivityIndicator size={16} />
            ) : (
              <TouchableOpacity onPress={onConfirm}>
                <Text>{confirmButton}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.bodyContent}>{children}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  headerButtonLeft: {
    position: 'absolute',
    left: 10,
  },
  headerButtonRight: {
    position: 'absolute',
    right: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  bodyContent: {
    paddingVertical: 20,
    maxHeight: '80%',
  },
  infoText: {
    marginBottom: 20,
    fontSize: 16,
    lineHeight: 24,
  },
});
