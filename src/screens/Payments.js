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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import {setID, setTransactions} from '../../redux/actions';
import Transfer from './customPaymentsButtons';
import {addData, fetchData, fetchTransactions} from './FirebaseFunctions';
import _ from 'lodash';
import firebase from 'firebase/compat';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function Payments({navigation}) {
  const {transactions} = useSelector(state => state.transactionReducer);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  var data = new Date();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [suma, setSuma] = useState();
  const [IBAN, setIBAN] = useState('');
  const [adresa, setAdresa] = useState('');

  // Preluare din baza de date
  const getTransactions = async () => {
    try {
      const tranzactii = await fetchTransactions('tranzactii');
      dispatch(setTransactions(tranzactii));
    } catch (error) {
      console.error('Error fetching transactions: ', error);
    }
  };

  const [showTransferForm, SetShowForm] = useState(false);
  const onPressHandler = () => {
    dispatch(setID(transactions.length + 1));
    SetShowForm(true);
  };

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
          IBAN_DC: IBAN,
          Nume_DC: name,
          Suma: suma,
          Desc: desc,
          Data: timestamp,
          Adresa: adresa,
          este_plata: 'da',
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
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleFromDateChange = (event, date) => {
    if (date) {
      const currentDate = new Date(date);
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() - 1);
      if (currentDate.getTime() > maxDate.getTime()) {
        alert("From date can't be after today.");
      } else if (toDate && currentDate.getTime() > toDate.getTime()) {
        alert("From date can't be after To date.");
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
        alert("To date can't be after today.");
      } else if (fromDate && currentDate.getTime() < fromDate.getTime()) {
        alert("To date can't be before From date.");
      } else {
        setToDate(currentDate);
      }
    }
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const hideDatePicker = () => {
    setShowPicker(false);
  };

  return (
    <View style={styles.scroll}>
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

      <Text style={styles.header}>Plati</Text>
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
              onPressButton={onPressHandler}
              iconName="file-invoice-dollar"
            />
            <Text style={styles.platiText}>Plata factura</Text>
          </View>
          <View style={styles.elementePlata}>
            <Transfer
              color="#f7b267"
              onPressButton={onPressHandler}
              iconName="level-down-alt"
            />
            <Text style={styles.platiText}>Intre conturile</Text>
            <Text style={styles.platiText}>mele</Text>
          </View>
        </View>
        <View style={styles.transactions}>
          <Text style={styles.transactionsText}>Tranzactii</Text>
          <TouchableOpacity onPress={showDatePicker}>
            <Text>Select Dates</Text>
          </TouchableOpacity>
          <View>
            <TextInput
              placeholder="From Date"
              value={fromDate ? fromDate.toDateString() : ''}
              editable={false}
            />
            <TextInput
              placeholder="To Date"
              value={toDate ? toDate.toDateString() : ''}
              editable={false}
            />
          </View>
          {showPicker && (
            <DateTimePicker
              value={fromDate || toDate || new Date()}
              mode="date"
              minimumDate={new Date('2000-01-01')}
              maximumDate={new Date()}
              onChange={(event, date) => {
                hideDatePicker();
                if (fromDate) {
                  handleToDateChange(event, date);
                } else {
                  handleFromDateChange(event, date);
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
          data={_.sortBy(transactions, 'Data').reverse()}
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
  header: {
    color: '#000',
    fontSize: 20,
    backgroundColor: '#f4845f',
    padding: 15,
    marginBottom: 20,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    opacity: 0.6,
  },
  plati: {
    flex: 1,
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
  image: {
    width: 420,
    height: 500,
    resizeMode: 'contain',
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
});
