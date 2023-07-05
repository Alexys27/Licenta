/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {fetchData} from './FirebaseFunctions';

export const TransferIntreConturiModal = ({visible, onRequestClose}) => {
  const [fromAccount, setFromAccount] = useState(null);
  const [toAccount, setToAccount] = useState(null);
  const [amount, setAmount] = useState('');
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [description, setDescription] = useState(
    'transfer intre conturi proprii',
  );
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await fetchData('conturi');
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts: ', error);
    }
  };

  const handleTransfer = () => {
    if (fromAccount && toAccount && amount && description) {
      // Perform the transaction logic here
      console.log('Performing transaction');
      console.log('From Account:', fromAccount);
      console.log('To Account:', toAccount);
      console.log('Amount:', amount);
      console.log('Description:', description);

      // Reset the form values
      setFromAccount(null);
      setToAccount(null);
      setAmount('');
      setDescription('transfer intre conturi proprii');

      // Close the modal
      onRequestClose();
    } else {
      console.log('Please fill in all the required fields');
    }
  };

  const handleAccountChange = (value, setAccount) => {
    if (value === fromAccount || value === toAccount) {
      // Prevent selecting the same account for both from and to
      Alert.alert('Nu poti alege acelasi cont');
    } else {
      setAccount(value);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      onRequestClose={onRequestClose}
      visible={visible}>
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={styles.centeredForm}>
          <View style={styles.tranzactieNoua}>
            <View style={styles.titluForm}>
              <Text style={styles.textTitluForm}>Transfer Intre Conturi</Text>
            </View>
            <View style={styles.inputsView}>
              <Text style={styles.labels}>From Account *</Text>
              <View style={styles.dropdownWrapper}>
                <DropDownPicker
                  open={openFrom}
                  setOpen={setOpenFrom}
                  items={accounts.map(account => ({
                    label: account.Title,
                    value: account.Title,
                  }))}
                  defaultValue={fromAccount}
                  value={fromAccount}
                  setValue={setFromAccount}
                  containerStyle={styles.dropdownContainer}
                  style={styles.dropdown}
                  dropDownStyle={styles.dropdown}
                  itemStyle={styles.dropdownItem}
                  onSelectItem={item =>
                    handleAccountChange(item.value, setFromAccount)
                  }
                />
              </View>
              <Text style={styles.labels}>To Account *</Text>
              <View style={styles.dropdownWrapper1}>
                <DropDownPicker
                  open={openTo}
                  setOpen={setOpenTo}
                  items={accounts
                    .filter(account => account.id !== fromAccount)
                    .map(account => ({
                      label: account.Title,
                      value: account.Title,
                    }))}
                  value={toAccount}
                  setValue={setToAccount}
                  defaultValue={toAccount}
                  containerStyle={styles.dropdownContainer}
                  style={styles.dropdown}
                  dropDownStyle={styles.dropdown}
                  itemStyle={styles.dropdownItem}
                  onSelectItem={item =>
                    handleAccountChange(item.value, setToAccount)
                  }
                />
              </View>

              <Text style={styles.labels}>Amount *</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter amount"
                onChangeText={value => setAmount(value)}
                value={amount}
              />

              <Text style={styles.labels}>Description</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter description"
                onChangeText={value => setDescription(value)}
                value={description}
              />
              <View style={styles.trimite}>
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleTransfer}>
                  <Text style={styles.buttonText}>Transfer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredForm: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000099',
  },
  tranzactieNoua: {
    flex: 0.75,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  titluForm: {
    width: '100%',
    backgroundColor: '#a3b18a',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textTitluForm: {
    fontSize: 20,
    textAlign: 'center',
  },
  inputsView: {
    flex: 1,
    marginTop: '10%',
    width: '100%',
  },
  input: {
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 10,
    elevation: 20,
  },
  ibanInput: {
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 10,
    elevation: 20,
  },
  numeInput: {
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 10,
    elevation: 20,
  },
  sumaInput: {
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 10,
    elevation: 20,
  },
  adresaInput: {
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 10,
    elevation: 20,
  },
  descriereInput: {
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 10,
    elevation: 20,
  },
  labels: {
    textAlign: 'left',
    marginLeft: '10%',
    padding: 5,
  },
  trimite: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%',
    marginBottom: '10%',
  },
  sendButton: {
    flex: 0.5,
    backgroundColor: '#f07167',
    width: 200,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  dropdown: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dropdownContainer: {
    width: '80%',
    height: 50,
    marginLeft: '10%',
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
  },
  dropdownItem: {
    justifyContent: 'flex-start',
  },
  dropdownWrapper: {
    position: 'relative',
    zIndex: 2,
  },
  dropdownWrapper1: {
    position: 'relative',
    zIndex: 1,
  },
});
