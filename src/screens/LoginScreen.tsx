import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import React from 'react';
import {useTheme} from '@utils/ThemeContext';

const LoginScreen = ({onLogin}: {onLogin: () => void}) => {
  const {colors} = useTheme();

  const handleLogin = async () => {
    onLogin();
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Text style={[styles.title, {color: colors.text}]}>Login</Text>
      <TextInput
        style={[
          styles.input,
          {backgroundColor: colors.surface, color: colors.text},
        ]}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
      />
      <TextInput
        style={[
          styles.input,
          {backgroundColor: colors.surface, color: colors.text},
        ]}
        placeholder="Password"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, {backgroundColor: colors.primary}]}
        onPress={handleLogin}>
        <Text style={[styles.buttonText, {color: colors.text}]}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
