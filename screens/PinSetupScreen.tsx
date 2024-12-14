import React, { useState } from 'react';
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

type PinSetupScreenProps = StackScreenProps<RootStackParamList, 'PinSetup'>;

const PinSetupScreen: React.FC<PinSetupScreenProps> = ({ navigation }) => {
  const [pin, setPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');

  const handlePinSetup = async () => {
    if (pin.length !== 4) {
      Alert.alert('Invalid PIN', 'PIN must be 4 digits');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('PIN Mismatch', 'PINs do not match');
      return;
    }

    try {
      await AsyncStorage.setItem('userPin', pin);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to save PIN');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Set up your PIN</Text>
      <TextInput
        style={styles.pinInput}
        keyboardType="numeric"
        maxLength={4}
        secureTextEntry
        value={pin}
        onChangeText={setPin}
        placeholder="Enter 4-digit PIN"
      />
      <TextInput
        style={styles.pinInput}
        keyboardType="numeric"
        maxLength={4}
        secureTextEntry
        value={confirmPin}
        onChangeText={setConfirmPin}
        placeholder="Confirm 4-digit PIN"
      />
      <TouchableOpacity style={styles.button} onPress={handlePinSetup}>
        <Text style={styles.buttonText}>Set PIN</Text>
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
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default PinSetupScreen;