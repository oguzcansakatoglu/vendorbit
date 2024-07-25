import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';

import {useAuth} from '../contexts/Auth';
import {useTheme} from '@utils/ThemeContext';

const SignupScreen: React.FC = () => {
  const {colors} = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {signUp} = useAuth();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await signUp(email, password, name);
      Alert.alert('Success', 'Account created successfully');
      // Navigate to the next screen or perform any other action
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleGoogleSignIn = async () => {};

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Text style={[styles.title, {color: colors.text}]}>Sign Up</Text>
      <TextInput
        style={[
          styles.input,
          {backgroundColor: colors.surface, color: colors.text},
        ]}
        placeholder="Name"
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[
          styles.input,
          {backgroundColor: colors.surface, color: colors.text},
        ]}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[
          styles.input,
          {backgroundColor: colors.surface, color: colors.text},
        ]}
        placeholder="Password"
        placeholderTextColor={colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, {backgroundColor: colors.primary}]}
        onPress={handleSignup}>
        <Text style={[styles.buttonText, {color: colors.text}]}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, {backgroundColor: colors.primary}]}
        onPress={handleGoogleSignIn}>
        <Text style={[styles.buttonText, {color: colors.text}]}>google</Text>
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

export default SignupScreen;
