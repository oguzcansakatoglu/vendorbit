import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';

import {useTheme} from '@utils/ThemeContext';

const BottomSlideDialog = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  cancelText,
  confirmText,
}) => {
  const {colors} = useTheme();
  const {height} = Dimensions.get('window');
  const translateY = useRef(new Animated.Value(height)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(height);
      scale.setValue(0.9);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 5,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          bounciness: 5,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, height, translateY, scale, opacity]);

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '80%',
      maxWidth: 400,
    },
    title: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    message: {
      marginBottom: 20,
      textAlign: 'center',
      color: colors.text,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      minWidth: 100,
    },
    buttonCancel: {
      backgroundColor: colors.border,
    },
    buttonConfirm: {
      backgroundColor: colors.primary,
    },
    textStyle: {
      color: colors.background,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  const animatedStyles = {
    transform: [{translateY}, {scale}],
    opacity,
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
      animationType="none">
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalView, animatedStyles]}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonCancel]}
                  onPress={onCancel}>
                  <Text style={styles.textStyle}>{cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonConfirm]}
                  onPress={onConfirm}>
                  <Text style={styles.textStyle}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default BottomSlideDialog;
