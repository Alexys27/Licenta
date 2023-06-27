/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {setFurnizori} from '../../redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';
import {fetchData} from './FirebaseFunctions';
export const CustomModal = ({
  visible,
  onRequestClose,
  setTransaction,
  setSuma,
  onIBANChange,
  onNumeBeneficiarChange,
  setDescriere,
}) => {
  const {furnizori} = useSelector(state => state.transactionReducer);

  const dispatch = useDispatch();
  useEffect(() => {
    getFurnizori();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [selectedValue, setSelectedValue] = useState(null);
  const [iban, setIBAN] = useState('');
  const [numeBeneficiar, setName] = useState('');
  const [open, setOpen] = useState(false);

  const getFurnizori = async () => {
    try {
      const firebaseFurnizori = await fetchData('furnizori');
      dispatch(setFurnizori(firebaseFurnizori));
    } catch (error) {
      console.error('Error fetching furnizori: ', error);
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
              <Text style={styles.textTitluForm}>Transfer nou</Text>
            </View>
            <KeyboardAvoidingView
              behavior={'padding'}
              style={styles.inputsView}>
              <Text style={styles.labels}>SELECTEAZA FURNIZOR *</Text>
              <View style={styles.dropdownWrapper}>
                <DropDownPicker
                  open={open}
                  value={selectedValue}
                  items={furnizori.map(furnizor => ({
                    label: furnizor.Nume_furnizor,
                    value: furnizor.Nume_furnizor,
                    iban: furnizor.IBAN_furnizor,
                  }))}
                  setOpen={setOpen}
                  setValue={setSelectedValue}
                  style={styles.dropdown}
                  textStyle={styles.dropdownText}
                  containerStyle={styles.dropdownContainer}
                  itemStyle={styles.dropdownItem}
                  onSelectItem={item => {
                    setSelectedValue(item.value);
                    setIBAN(item.iban || '');
                    setName(item.value || '');
                    onNumeBeneficiarChange(item.value);
                    onIBANChange(item.iban);
                    setDescriere('Facturi');
                    console.log(iban, numeBeneficiar);
                  }}
                />
              </View>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView>
                  <View>
                    <Text style={styles.labels}>IN CONTUL *</Text>
                    <TextInput
                      autoCapitalize="characters"
                      style={styles.ibanInput}
                      placeholder="IBAN"
                      onChangeText={value => {
                        setIBAN(value);
                        // Pass the updated value to the prop callback
                      }}
                      value={iban}
                    />
                    <Text style={styles.labels}>NUME BENEFICIAR *</Text>
                    <TextInput
                      style={styles.numeInput}
                      placeholder="Nume furnizor"
                      onChangeText={value => {
                        setName(value); // Pass the updated value to the prop callback
                      }}
                      value={numeBeneficiar}
                    />
                    <Text style={styles.labels}>NUMAR FACTURA *</Text>
                    <TextInput
                      style={styles.descriereInput}
                      placeholder="ex: 111222333"
                    />
                    <Text style={styles.labels}>SUMA *</Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.sumaInput}
                      placeholder="00.00 RON"
                      onChangeText={value => setSuma(parseFloat(value))}
                    />

                    <Text style={styles.labels}>DESCRIERE</Text>
                    <TextInput
                      style={styles.descriereInput}
                      placeholder="Transfer"
                      value="Facturi"
                    />
                    <View style={styles.trimite}>
                      <TouchableOpacity
                        onPress={setTransaction}
                        style={styles.sendButton}>
                        <Text>Trimite</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%',
    marginBottom: '10%',
  },
  sendButton: {
    flex: 1,
    backgroundColor: '#f07167',
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  dropdownWrapper: {
    position: 'relative',
    zIndex: 1,
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
});
