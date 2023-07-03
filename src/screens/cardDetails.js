/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  View,
  Text,
  ToastAndroid,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';

const PopupComponent = ({isVisible, textToCopy, onClose}) => {


  const copyToClipboard = () => {
    Clipboard.setString(textToCopy);
    ToastAndroid.show('Text copied to clipboard', ToastAndroid.SHORT);
  };

  return (
    <View>
      <Modal visible={isVisible} transparent={true} animationType="fade">
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          onPress={onClose}>
          <View
            style={{backgroundColor: 'white', padding: 16, borderRadius: 8}}>
            <Text>{textToCopy}</Text>
            <TouchableOpacity onPress={copyToClipboard}>
              <Text style={{marginTop: 8, color: 'blue'}}>
                Copy to Clipboard
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PopupComponent;
