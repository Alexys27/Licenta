/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {Modal, View, TextInput, TouchableOpacity, Text} from 'react-native';
const FiltrareTranzactii = ({visible, onClose, onConfirm}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };
};