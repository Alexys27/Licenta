/* eslint-disable prettier/prettier */
import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export  default function Transfer (props){
  return (
    <TouchableOpacity onPress={props.onPressButton} style={[styles.transfer, {backgroundColor:props.color}]}>
      <FontAwesome5 name={props.iconName} size={30} color="#000" />
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  transfer: {
    alignItems: 'center',
    // backgroundColor: '#a3b18a',
    justifyContent: 'center',
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  factura: {
    alignItems: 'center',
    // backgroundColor: '#f25c54',
    justifyContent: 'center',
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  contPropriu: {
    alignItems: 'center',
    // backgroundColor: '#f7b267',
    justifyContent: 'center',
    height: 60,
    width: 60,
    borderRadius: 50,
  },
});
