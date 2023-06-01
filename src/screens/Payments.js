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
    setFacturiModal(true);
  };

  const handleCloseModal = () => {
    setFacturiModal(false);
    console.log(facturiModal);
  };

  const handleSetTransaction = () => {
    // Handle set transaction logic
    setTransaction();
  };

  const handleSetIBAN = value => {
    // Handle set IBAN logic
  };

  const handleSetName = value => {
    // Handle set name logic
  };

  const handleSetSuma = value => {
    // Handle set suma logic
  };

  const handleSetAdresa = value => {
    // Handle set adresa logic
  };

  const handleSetDesc = value => {
    // Handle set desc logic
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
      if (acc.Title === 'Pachet Personalizat') {
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

  return (
    <View style={styles.scroll}>
      <CustomModal
        visible={facturiModal}
        onRequestClose={handleCloseModal}
        setTransaction={handleSetTransaction}
        setIBAN={handleSetIBAN}
        setName={handleSetName}
        setSuma={handleSetSuma}
        setAdresa={handleSetAdresa}
        setDesc={handleSetDesc}
      />
      <ScrollView nestedScrollEnabled>
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
                        <Text style={styles.labels}>DESCRIERE</Text>
                        <TextInput
                          style={styles.descriereInput}
                          placeholder="Transfer"
                          onChangeText={value => setDesc(value)}
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
      </ScrollView>

      <View style={styles.paymetsPage}>
        <View style={styles.plati}>
          <View style={styles.elementePlata}>
            <Transfer
              color="#a3b18a"
              onPressButton={onPressHandler}
              iconName="level-up-alt"
            />
            <Text style={styles.platiText}>Transfer</Text>
          </View>
          <View style={styles.elementePlata}>
            <Transfer
              color="#f25c54"
              onPressButton={handleOpenModal}
              iconName="file-invoice-dollar"
            />
            <Text style={styles.platiText}>Plata factura</Text>
          </View>
          <View style={styles.elementePlata}>
            <Transfer
              color="#f7b267"
              onPressButton={handleOpenModal}
              iconName="level-down-alt"
            />
            <Text style={styles.platiText}>Intre conturile</Text>
            <Text style={styles.platiText}>mele</Text>
          </View>
        </View>
        <Button title="Cancel Filter" onPress={handleReset} />
        <Button title="Filter" onPress={handleFilterByDate} />
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
                    item.este_plata === 'da'
                      ? {color: 'red'}
                      : {color: 'green'},
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
    </View>
  );
}

const styles = StyleSheet.create({
  plati: {
    marginTop: 50,
    marginBottom: 60,
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

  paymetsPage: {
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
    marginRight: '10%',
    textAlign: 'right',
    fontSize: 20,
    color: 'red',
  },
  tranzactie: {
    borderBottomWidth: 0.2,
  },
  listaTranzactii: {
    height: '68%',
    marginTop: 20,
    width: '100%',
    borderColor: 'black',
  },
  dateContainer: {
    flex: 1,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputDateContainer: {
    flex: 0.3,
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
