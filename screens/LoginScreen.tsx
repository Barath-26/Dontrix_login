import React, { useState, useEffect } from 'react';
import { 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  SafeAreaView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import * as LocalAuthentication from 'expo-local-authentication';

type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [pin, setPin] = useState<string>('');
  const [isBiometricAvailable, setIsBiometricAvailable] = useState<boolean>(false);
  const [isPinSet, setIsPinSet] = useState<boolean>(false);

  useEffect(() => {
    checkPinAndBiometrics();
  }, []);

  const checkPinAndBiometrics = async () => {
    try {
      // Check if PIN is already set
      const storedPin = await AsyncStorage.getItem('userPin');
      
      if (storedPin) {
        setIsPinSet(true);
      } else {
        // If no PIN is set, navigate to PIN setup
        navigation.replace('PinSetup');
      }

      // Check biometric availability
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricAvailable(hasHardware && isEnrolled);
    } catch (error) {
      console.error('Error checking PIN', error);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to log in',
        fallbackLabel: 'Enter PIN'
      });

      if (result.success) {
        navigation.replace('Home');
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const storedPin = await AsyncStorage.getItem('userPin');
      
      if (storedPin === pin) {
        navigation.replace('Home');
      } else {
        Alert.alert('Error', 'Incorrect PIN');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    }
  };

  const handleSetPin = () => {
    navigation.replace('PinSetup');
  };

  if (!isPinSet) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>PIN Not Set</Text>
        <TouchableOpacity style={styles.button} onPress={handleSetPin}>
          <Text style={styles.buttonText}>Set PIN</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Enter PIN</Text>
      <TextInput
        style={styles.pinInput}
        keyboardType="numeric"
        maxLength={4}
        secureTextEntry
        value={pin}
        onChangeText={setPin}
        placeholder="Enter your PIN"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      
      {isBiometricAvailable && (
        <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricAuth}>
          <Text style={styles.buttonText}>Use Biometric Login</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity style={styles.changePinButton} onPress={handleSetPin}>
        <Text style={styles.changePinButtonText}>Change PIN</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  pinInput: {
    width: '80%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18
  },
  button: {
    width: '80%',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10
  },
  biometricButton: {
    width: '80%',
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10
  },
  changePinButton: {
    width: '80%',
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  changePinButtonText: {
    color: 'white',
    fontSize: 14
  }
});

export default LoginScreen;