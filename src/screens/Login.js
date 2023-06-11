/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import auth from '@react-native-firebase/auth';

// Import your bank logo image
import bankLogo from '../images/bank.png';

const Login = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState(null);

  const sendCode = async () => {
      if (!phoneNumber) {
        Alert.alert('Itrodu un numar de telefon');
        return;
      }
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
    } catch (e) {
      console.error(e);
    }
  };

  const verifyCode = async () => {
      if (!code) {
        Alert.alert('Introdu codul de verificare');
        return;
      }
    try {
      await confirm.confirm(code);
      navigation.navigate('Home');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      {/* Add the bank logo */}
      <Image source={bankLogo} style={styles.logo} />

      <Text style={styles.text}>Introdu numărul de telefon:</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setPhoneNumber(text)}
        value={phoneNumber}
        keyboardType="phone-pad"
      />
      {confirm ? (
        <>
          <Text style={styles.text}>Introdu codul de verificare:</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setCode(text)}
            value={code}
            keyboardType="number-pad"
          />
          <TouchableOpacity style={styles.buton} onPress={verifyCode}>
            <Text style={styles.buttonText}>Verificare cod</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.buton} onPress={sendCode}>
          <Text style={styles.buttonText}>Trimite cod</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderRadius: 5,
    width: '80%',
    height: 50,
    fontSize: 18,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buton: {
    width: 120,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#e29578',
  },
});

export default Login;
