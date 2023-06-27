/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Platform,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import {
  setID,
  setTransactions,
  setAccID,
  setNewAccounts,
} from '../../redux/actions';
import Transfer from './customPaymentsButtons';
import {
  addData,
  fetchData,
  fetchTransactions,
  fetchTransactionsByDate,
  updateSold,
} from './FirebaseFunctions';
import _ from 'lodash';
import firebase from 'firebase/compat';
import {Timestamp} from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import {CustomModal} from './customModalTransfer';
import moment from 'moment';
import Filtering from '../components/filtering';
import DropDownPicker from 'react-native-dropdown-picker';
export default function Payments({navigation}) {
  const {transactions} = useSelector(state => state.transactionReducer);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [suma, setSuma] = useState();
  const [IBAN, setIBAN] = useState('');
  const [adresa, setAdresa] = useState('');
  const [tipTranzactie, setTipTranzactie] = useState('da');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const {accounts} = useSelector(state => state.transactionReducer);
  const [ibanContCurent, setIbanContCurent] = useState();
  const [showTransferForm, SetShowForm] = useState(false);
  const [titluContAles, setTitluContAles] = useState();
  const [facturiModal, setFacturiModal] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpenModal = () => {
    accounts.map(acc => {
      if (acc.Title === 'Cont Principal') {
        setIbanContCurent(acc.IBAN_cont);
      }
    });
    setFacturiModal(true);
  };

  const handleCloseModal = () => {
    setFacturiModal(false);
    console.log(facturiModal);
  };

  useEffect(() => {
    getAccounts();
    getTransactions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Preluare din baza de date
  const getTransactions = async () => {
    try {
      const tranzactii = await fetchTransactions('tranzactii');
      setFilteredTransactions(tranzactii);
      dispatch(setTransactions(tranzactii));
      const sumeTranzactii = tranzactii.map(trans => {
        if (trans.este_plata === 'da') {
          return -trans.Suma;
        } else {
          return trans.Suma;
        }
      });
      var sumaTranzactii = 0;
      for (let i = 0; i < sumeTranzactii.length; i++) {
        sumaTranzactii += sumeTranzactii[i];
      }
      updateSold('cont_principal', sumaTranzactii);
    } catch (error) {
      console.error('Error fetching transactions: ', error);
    }
  };
  const getAccounts = async () => {
    try {
      const firebaseAccounts = await fetchData('conturi');
      dispatch(setNewAccounts(firebaseAccounts));
    } catch (error) {
      console.error('Error fetching accounts: ', error);
    }
  };
  //sa ramana doar pressHandlerTransfer, pentru restul, separat
  const onPressHandler = () => {
    dispatch(setID(transactions.length + 1));
    accounts.map(acc => {
      if (acc.Title === 'Cont Principal') {
        setIbanContCurent(acc.IBAN_cont);
      }
    });
    SetShowForm(true);
  };
  //TO-DO: handler de modificare IBAN_cont la alegerea din meniul 'din contul'

  const setTransaction = () => {
    const timestamp = firebase.firestore.Timestamp.fromDate(new Date());
    if (name.length === 0 || suma.length === 0 || IBAN.length === 0) {
      Alert.alert('Atentie!', 'Toate campurile notate cu (*) sunt obligatorii');
    } else if (IBAN.length !== 24) {
      Alert.alert('Eroare!', 'Introduceti un IBAN corect!');
    } else {
      try {
        var Transaction = {
          ID_utilizator: 1,
          IBAN_cont: ibanContCurent,
          IBAN_DC: IBAN,
          Nume_DC: name,
          Suma: suma,
          Desc: desc,
          Data: timestamp,
          Adresa: adresa,
          este_plata: tipTranzactie,
        };
        addData('tranzactii', Transaction);

        Alert.alert('Succes!', 'Tranzactia s-a efectuat cu succes.');
        //Aici trebuie apelata functia de inserare in baza de date cu parametul 'Transaction'
        SetShowForm(false);
        setName('');
        setDesc('');
        setSuma('');
        setIBAN('');
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleRefresh = async () => {
    setIsRefreshing(true);
    getTransactions();
    setIsRefreshing(false);
  };

  //filtrare dupa data
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const showFromDatepicker = () => {
    setShowPicker('from');
  };

  const showToDatepicker = () => {
    setShowPicker('to');
  };

  const hideDatePicker = () => {
    setShowPicker(false);
  };
  const handleFilterChange = query => {
    // Perform filtering logic based on the query and update the transactions state accordingly
    // For example, filter transactions whose name or description contains the query
    const filtered = transactions.filter(
      transaction =>
        transaction.Nume_DC.includes(query) || transaction.Desc.includes(query),
    );

    // Update the filtered transactions
    // Here, you can set the filtered transactions to a separate state variable or use it directly in your FlatList
    // For simplicity, let's assume you have a separate state variable called 'filteredTransactions'
    setFilteredTransactions(filtered);
  };
  const handleFilterByDate = async () => {
    const dataTranzactii = await fetchTransactionsByDate(
      'tranzactii',
      fromDate,
      toDate,
    );
    setFilteredTransactions(dataTranzactii);
  };
  const handleFromDateChange = (event, date) => {
    if (date) {
      const currentDate = new Date(date);
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() - 1);
      if (currentDate.getTime() > maxDate.getTime()) {
        Alert.alert("From date can't be after today.");
      } else if (toDate && currentDate.getTime() > toDate.getTime()) {
        Alert.alert("From date can't be after To date.");
      } else {
        setFromDate(currentDate);
      }
    }
  };

  const handleToDateChange = (event, date) => {
    if (date) {
      const currentDate = new Date(date);
      const maxDate = new Date();
      if (currentDate.getTime() > maxDate.getTime()) {
        Alert.alert("To date can't be after today.");
      } else if (fromDate && currentDate.getTime() < fromDate.getTime()) {
        Alert.alert("To date can't be before From date.");
      } else {
        setToDate(currentDate);
      }
    }
  };
  const handleReset = () => {
    setFromDate('');
    setToDate('');
    setFilteredTransactions(transactions);
  };
  const handleChangeValue = value => {
    setDesc(value);
  };
  const handleIBANChange = value => {
    setIBAN(value);
    console.log(IBAN);
  };
  const handleNumeBeneficiarChange = value => {
    setName(value);
    console.log(name);
  };
  const handleSetSuma = value => {
    setSuma(value);
    console.log(suma);
  };
  const handleSetTransaction = () => {
    // Handle set transaction logic
    console.log(suma);
    console.log(IBAN);
    console.log(name);
    console.log(desc);
    console.log(ibanContCurent);
    setTransaction();
  };
  const handlesetDescriere = value => {
    setDesc(value);
  };
  return (
    <View style={styles.paymetsPage}>
      <CustomModal
        visible={facturiModal}
        onRequestClose={handleCloseModal}
        setTransaction={handleSetTransaction}
        setSuma={handleSetSuma}
        onIBANChange={handleIBANChange}
        onNumeBeneficiarChange={handleNumeBeneficiarChange}
        setDescriere={handlesetDescriere}
      />
      <Modal
        animationType="slide"
        transparent
        onRequestClose={() => SetShowForm(false)}
        visible={showTransferForm}>
        <TouchableWithoutFeedback onPress={() => SetShowForm(false)}>
          <View style={styles.centeredForm}>
            <View style={styles.tranzactieNoua}>
              <View style={styles.titluForm}>
                <Text style={styles.textTitluForm}>Transfer nou</Text>
              </View>
              <KeyboardAvoidingView
                behavior={'padding'}
                style={styles.inputsView}>
                <Text style={styles.labels}>DESCRIERE *</Text>
                <View style={styles.centeredDesc}>
                  <DropDownPicker
                    items={[
                      {label: 'Mancare', value: 'Mancare'},
                      {label: 'Chirie', value: 'Chirie'},
                      {label: 'Facturi', value: 'Facturi'},
                      {label: 'Abonamente', value: 'Abonamente'},
                      {label: 'Altele', value: 'Altele'},
                    ]}
                    open={open}
                    setOpen={setOpen}
                    value={desc}
                    containerStyle={styles.dropdownContainer}
                    style={styles.dropdown}
                    itemStyle={styles.dropdownItem}
                    dropDownStyle={styles.dropdown}
                    setValue={setDesc}
                    onChangeValue={handleChangeValue}
                    placeholder="Selecteaza categorie"
                    zIndex={9999}
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
                        onChangeText={value => setIBAN(value)}
                      />
                      <Text style={styles.labels}>NUME BENEFICIAR *</Text>
                      <TextInput
                        style={styles.numeInput}
                        placeholder="ex: Maria"
                        onChangeText={value => setName(value)}
                      />
                      <Text style={styles.labels}>SUMA *</Text>
                      <TextInput
                        keyboardType="numeric"
                        style={styles.sumaInput}
                        placeholder="00.00 RON"
                        onChangeText={value => setSuma(parseFloat(value))}
                      />
                      <Text style={styles.labels}>ADRESA</Text>
                      <TextInput
                        style={styles.adresaInput}
                        placeholder="Str., Bl., Nr., Ap."
                        onChangeText={value => setAdresa(value)}
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
      <View style={styles.plati}>
        <View style={styles.elementePlata}>
          <Transfer
            color="#B8D3C8"
            onPressButton={onPressHandler}
            iconName="level-up-alt"
          />
          <Text style={styles.platiText}>Transfer</Text>
        </View>
        <View style={styles.elementePlata}>
          <Transfer
            color="#A4C3B2"
            onPressButton={handleOpenModal}
            iconName="file-invoice-dollar"
          />
          <Text style={styles.platiText}>Plata factura</Text>
        </View>
        <View style={styles.elementePlata}>
          <Transfer
            color="#CCE3DE"
            onPressButton={handleOpenModal}
            iconName="level-down-alt"
          />
          <Text style={styles.platiText}>Intre conturile</Text>
          <Text style={styles.platiText}>mele</Text>
        </View>
      </View>
      {/* <Button title="Cancel Filter" onPress={handleReset} />
        <Button title="Filter" onPress={handleFilterByDate} /> */}
      <Modal visible={false}>
        <View style={styles.dateContainer}>
          <View style={styles.inputDateContainer}>
            <TouchableOpacity onPress={showFromDatepicker}>
              <FontAwesome5 name="calendar" size={20} color="#000" />
              <TextInput
                placeholder="De la"
                style={styles.input}
                value={fromDate ? fromDate.toLocaleDateString('en-GB') : ''}
                editable={false}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputDateContainer}>
            <TouchableOpacity onPress={showToDatepicker}>
              <FontAwesome5 name="calendar" size={20} />
              <TextInput
                placeholder="Pana la"
                style={styles.input}
                value={toDate ? toDate.toLocaleDateString('en-GB') : ''}
                editable={false}
              />
            </TouchableOpacity>
          </View>
          {showPicker && (
            <DateTimePicker
              value={fromDate || toDate || new Date()}
              mode="date"
              minimumDate={new Date('2000-01-01')}
              maximumDate={new Date()}
              onChange={(event, date) => {
                hideDatePicker();
                if (showPicker === 'from') {
                  handleFromDateChange(event, date);
                } else {
                  handleToDateChange(event, date);
                }
              }}
            />
          )}
        </View>
      </Modal>
      <Filtering onFilterChange={handleFilterChange} />
      <FlatList
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        // initialScrollIndex={transactions.length - 1}
        style={styles.listaTranzactii}
        data={_.sortBy(filteredTransactions, transaction =>
          moment(transaction.Data, 'DD/MM/YYYY'),
        ).reverse()}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 15,
        }}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.tranzactie}>
            <View style={styles.itemTranzactie}>
              <FontAwesome5
                style={styles.cardIcon}
                name="money-check"
                size={30}
                color="#000"
              />
              <View style={styles.descriereTranzactie}>
                <Text style={styles.text_item_title}>{item.Data}</Text>
                <Text style={styles.text_item_title}>{item.Nume_DC}</Text>
                <Text style={styles.text_item}>{item.Desc}</Text>
              </View>
              <Text
                style={[
                  styles.text_item_suma,
                  item.este_plata === 'da' ? {color: 'red'} : {color: 'green'},
                ]}>
                {item.este_plata === 'da' ? '-' : '+'}
                {item.Suma}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    width: '80%',
    justifyContent: 'center',
    height: 40,
    marginVertical: 10,
    borderRadius: 4,
    backgroundColor: '#fff',
    elevation: 20,
    zIndex: 9999,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderColor: '#fff',
  },
  dropdownItem: {
    justifyContent: 'flex-start',
  },
  scrollViewStyle: {
    flexGrow: 1,
  },
  plati: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  platiText: {
    textAlign: 'center',
    fontSize: 15,
  },
  elementePlata: {
    margin: 10,
    width: 100,
    height: 100,
    alignItems: 'center',
  },
  centeredDesc: {
    alignItems: 'center',
    zIndex: 9999,
  },
  paymetsPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  scroll: {
    backgroundColor: '#fff',
  },
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
  item: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 2,
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 25,
  },
  list: {
    flex: 1,
    height: '100%',
    marginTop: '5%',
  },
  transactionsText: {
    fontSize: 25,
    color: '#cc444b',
  },
  scrollList: {
    marginTop: 10,
    backgroundColor: '#fff',
  },

  text_header: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  text_item: {
    marginLeft: 20,
    color: '#999',
  },
  text_item_title: {
    marginLeft: 20,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  cardIcon: {
    marginLeft: 10,
  },
  itemTranzactie: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  text_item_suma: {
    flex: 1,
    textAlign: 'right',
    fontSize: 15,
    color: 'red',
  },
  tranzactie: {
    borderBottomWidth: 0.2,
  },
  listaTranzactii: {
    flex: 1,
    width: '100%',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputDateContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  input: {
    height: 40,
    marginLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
