/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {Modal, View, TextInput, TouchableOpacity, Text} from 'react-native';

const IntroducereSuma = ({visible, onClose, onConfirm, onAmountChange}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            width: '80%',
          }}>
          <TextInput
            placeholder="Introdu suma dorita"
            onChangeText={onAmountChange}
            style={{
              marginBottom: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: 'gray',
            }}
          />
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <TouchableOpacity onPress={onClose}>
              <Text style={{marginRight: 10}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm}>
              <Text>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


export default IntroducereSuma;
