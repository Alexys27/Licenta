/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Text} from 'react-native';
import auth from '@react-native-firebase/auth';

const Login = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState(null);

  const sendCode = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
    } catch (e) {
      console.error(e);
    }
  };

  const verifyCode = async () => {
    try {
      await confirm.confirm(code);
      navigation.navigate('Home');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Enter phone number:</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setPhoneNumber(text)}
        value={phoneNumber}
        keyboardType="phone-pad"
      />
      {confirm ? (
        <>
          <Text style={styles.text}>Enter verification code:</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setCode(text)}
            value={code}
            keyboardType="number-pad"
          />
          <Button title="Verify Code" onPress={verifyCode} />
        </>
      ) : (
        <Button title="Send Code" onPress={sendCode} />
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
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '80%',
    height: 50,
    fontSize: 18,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default Login;
