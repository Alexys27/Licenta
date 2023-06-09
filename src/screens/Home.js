/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import PopupComponent from './cardDetails';
import {
  setTransactions,
  setAccID,
  setNewAccounts,
  SET_TRANSACTION,
} from '../../redux/actions';
import {
  deleteData,
  fetchData,
  addData,
  fetchTransactions,
  updateSold,
} from './FirebaseFunctions';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import IntroducereSuma from './economiiSuma';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAc-JBu8CLMeyFZuJaFzlgfk7_2wbUKuk4',
  authDomain: 'mobilebanking-bfee7.firebaseapp.com',
  projectId: 'mobilebanking-bfee7',
  storageBucket: 'mobilebanking-bfee7.appspot.com',
  messagingSenderId: '364758268502',
  appId: '1:364758268502:web:308da7c8469378fa1959f7',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default function Home() {
  const [cardNumber, setCardNumber] = useState('XXXX XXXX XXXX 1445');
  const [cvv, setCvv] = useState('XXX');
  const [viewCardNumber, setViewCardNumber] = useState(false);
  const [sold, setSold] = useState(0);
  const [soldContNou, setSoldContNou] = useState(0);
  var titluContNou;
  const [showTransferForm, setShowForm] = useState(false);
  const [visiblePopUp, setVisiblePopUp] = useState(false);
  const [cardDet, setCardDet] = useState('Detalii card');
  const {accounts, transactions} = useSelector(
    state => state.transactionReducer,
  );
  const dispatch = useDispatch();
  const getCurrentDate = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    //Alert.alert(date + '-' + month + '-' + year);
    // You can turn it in to your desired format
    return date + '/' + month + '/' + year; //format: d-m-y;
  };

  var data = getCurrentDate();
  useEffect(() => {
    // getTransactions();
    getAccounts();
    getTransactions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // functie generare iban
  function generateRomanianIBAN() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const countryCode = 'RO';
    const bankCode = 'RNCB';
    const accountNumber = Math.floor(Math.random() * 1000000000000000)
      .toString()
      .padStart(16, '0');
    const controlDigit = '00';
    const iban = countryCode + controlDigit + bankCode + accountNumber;

    // Calculate the checksum using the MOD97 algorithm
    let checksum = 0;
    for (let i = 0; i < iban.length; i++) {
      const charValue = characters.indexOf(iban.charAt(i)) + 10;
      checksum = (charValue > 9 ? checksum * 100 : checksum * 10) + charValue;
      checksum %= 97;
    }
    checksum = 98 - checksum;
    const ibanWithChecksum =
      countryCode +
      checksum.toString().padStart(2, '0') +
      bankCode +
      accountNumber;

    return ibanWithChecksum;
  }
  const getTransactions = async () => {
    try {
      const tranzactii = await fetchTransactions('tranzactii');
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
      updateSold('cont_principal', parseFloat(sumaTranzactii.toFixed(2)));
    } catch (error) {
      console.error('Error fetching transactions: ', error);
    }
  };
  //preluare conturi
  const getAccounts = async () => {
    try {
      const firebaseAccounts = await fetchData('conturi');
      dispatch(setNewAccounts(firebaseAccounts));
      firebaseAccounts.map(acc => {
        const ID = acc.id;
        if (ID === 'cont_principal') {
          const soldCont = acc.Sold;
          setCardDet(
            'IBAN:' +
              ` ${acc.IBAN_cont}` +
              '\nTitular: Mesina Alexandra' +
              '\nBanca: LEX BANK' +
              '\nValuta: Lei',
          );
          setSold(parseFloat(soldCont.toFixed(2)));
        }
      });
    } catch (error) {
      console.error('Error fetching accounts: ', error);
    }
  };

  const setTransaction = (ibanCont, titlu, suma, plata) => {
    const timestamp = firebase.firestore.Timestamp.fromDate(new Date());
    if (suma <= 0) {
      Alert.alert('Eroare!', 'Suma trebuie sa fie mai mare decat 0!');
    } else {
      try {
        var Transaction = {
          ID_utilizator: 1,
          IBAN_cont: ibanCont,
          Nume_DC: titlu,
          Suma: suma,
          Desc: 'transfer intre conturi proprii',
          Data: timestamp,
          este_plata: plata,
        };
        addData('tranzactii', Transaction);
        Alert.alert('Succes!', 'Tranzactia s-a efectuat cu succes.');
      } catch (error) {
        console.log(error);
      }
    }
  };

  //setare conturi

  const [showIntroducere, setShowIntroducere] = useState(false);
  const [showIntroducere1, setShowIntroducere1] = useState(false);
  const [showIntroducere2, setShowIntroducere2] = useState(false);
  const [showIntroducere3, setShowIntroducere3] = useState(false);
  const setAccounts = id => {
    titluContNou = id;
    if (soldContNou <= 0) {
      Alert.alert('Eroare!', 'Suma introdusa trebuie sa fie mai mare decat 0');
      return;
    } else {
      try {
        const Account = {
          Title: titluContNou,
          Sold: parseFloat(soldContNou),
          DataCreare: data,
          ID_utilizator: 1,
          IBAN_cont: generateRomanianIBAN(),
        };
        const newAccounts = [...accounts, Account];
        AsyncStorage.setItem('Accounts', JSON.stringify(newAccounts))
          .then(() => {
            dispatch(setNewAccounts(newAccounts));
            addData('conturi', Account);
            setTransaction(
              Account.IBAN_cont,
              Account.Title,
              parseFloat(Account.Sold),
              'da',
            );

            Alert.alert('Succes!', 'Contul a fost creat cu succes.');
          })
          .catch(err => console.log(err));
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleAmountChange = value => {
    setSoldContNou(value);
  };
  //functie pentru apasarea butonului necesar crearii unui cont nou
  const onPressNewAccount = async () => {
    dispatch(setAccID(accounts.length + 1));
    setShowForm(true);
  };
  const deleteAccount = async id => {
    try {
      await deleteData('conturi', id);
      getTransactions();
      getAccounts();
    } catch (error) {}
  };
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    getAccounts();
    setIsRefreshing(false);
  };
  const handleOpenPopup = () => {
    setVisiblePopUp(true);
  };
  const closePopup = () => {
    setVisiblePopUp(false);
  };
  return (
    <SafeAreaView style={styles.mainView}>
      <Text style={styles.balance}>SOLD</Text>
      <Text style={styles.money}>{sold} RON</Text>
      <PopupComponent
        isVisible={visiblePopUp}
        textToCopy={cardDet}
        onClose={closePopup}
      />
      <TouchableOpacity onLongPress={handleOpenPopup} style={styles.cardView}>
        <LinearGradient
          style={styles.cardView}
          colors={['#CCE3DE', '#A4C3B2', '#6B9080']}>
          <TouchableOpacity>
            <FontAwesome5
              style={styles.visible}
              name="low-vision"
              size={20}
              color={'#333'}
              onPress={() => {
                if (!viewCardNumber) {
                  setViewCardNumber(true);
                  setCardNumber('4256 2356 4474 1445');
                  setCvv('348');
                } else {
                  setCardNumber('XXXX XXXX XXXX 1445');
                  setCvv('XXX');
                  setViewCardNumber(false);
                }
              }}
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.cardNr}>{cardNumber}</Text>
            <View style={styles.importantData}>
              <Text style={styles.expDate}>EXP: {'05/27'}</Text>
              <Text style={styles.cvv}>CVV {cvv}</Text>

              <FontAwesome5
                style={styles.visa}
                name="cc-visa"
                size={20}
                color={'#333'}
              />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.secondView}>
        <FlatList
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          style={styles.listaConturi}
          data={accounts}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{paddingBottom: 10}}
          renderItem={({item}) => (
            <Pressable
              onLongPress={() => {
                setTransaction(item.IBAN_cont, item.Title, item.Sold, 'nu');
                deleteAccount(item.id);
              }}
              style={styles.contNouComponent}>
              <View style={styles.titluContNou}>
                <Text>{item.Title}</Text>
              </View>
              <View style={styles.elementeContNou}>
                <Text style={styles.soldContCurent}>
                  {parseFloat(item.Sold.toFixed(2))} RON
                </Text>
              </View>
            </Pressable>
          )}
        />
        <TouchableOpacity
          onPress={onPressNewAccount}
          style={styles.deschidereCont}>
          <FontAwesome5 name="plus" size={20} color={'#333'} />
          <Text style={styles.textDeschidere}>Deschide cont nou</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          onRequestClose={() => {
            setShowForm(false);
            getTransactions();
            getAccounts();
          }}
          visible={showTransferForm}>
          <View style={styles.newAccountData}>
            <TouchableOpacity style={styles.butonCont}>
              <View style={styles.contTitle}>
                <Text>Cont de economii</Text>
              </View>
              <View>
                <Text>
                  In acest cont vei putea adauga si retrage bani oricand fara ca
                  dobanda ta sa se modifice. Dobanda: 2.5%/an
                </Text>
              </View>
              <View style={styles.trimite}>
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={() => setShowIntroducere(true)}>
                  <Text>Creeaza cont economii</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            <IntroducereSuma
              visible={showIntroducere}
              onClose={() => setShowIntroducere(false)}
              onConfirm={() => setAccounts('Cont Economii')}
              onAmountChange={handleAmountChange}
            />
            <TouchableOpacity style={styles.butonCont}>
              <View style={styles.contTitle}>
                <Text>Depozit la termen</Text>
              </View>
              <View>
                <Text>
                  In acest cont adaugi bani acum si ii vei putea retrage dupa o
                  data stabilita.
                </Text>
              </View>
              <View style={styles.trimite}>
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={() => setShowIntroducere1(true)}>
                  <Text> 3 luni = 5.2%</Text>
                </TouchableOpacity>
                <IntroducereSuma
                  visible={showIntroducere1}
                  onClose={() => setShowIntroducere1(false)}
                  onConfirm={() => setAccounts('Depozit (5.2%)')}
                  onAmountChange={handleAmountChange}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={() => setShowIntroducere2(true)}>
                  <Text> 6 luni = 6.1%</Text>
                </TouchableOpacity>
                <IntroducereSuma
                  visible={showIntroducere2}
                  onClose={() => setShowIntroducere2(false)}
                  onConfirm={() => setAccounts('Depozit (6.1%)')}
                  onAmountChange={handleAmountChange}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={() => setShowIntroducere3(true)}>
                  <Text> 12 luni = 7.5%</Text>
                </TouchableOpacity>
                <IntroducereSuma
                  visible={showIntroducere3}
                  onClose={() => setShowIntroducere3(false)}
                  onConfirm={() => setAccounts('Depozit (7.5%)')}
                  onAmountChange={handleAmountChange}
                />
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contTitle: {
    borderBottomWidth: 0.2,
    marginBottom: 10,
  },
  butonCont: {
    elevation: 10,
    margin: '10%',
    padding: 20,
    backgroundColor: 'white',
  },
  mainView: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-end',
  },
  secondView: {
    flex: 1,
    marginTop: '10%',
    backgroundColor: '#f5f3f4',
    alignItems: 'center',
  },
  cardView: {
    flex: 0.8,
    borderRadius: 25,
    margin: 2,
  },
  importantData: {
    flexDirection: 'row',
  },
  cvv: {
    color: '#333',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 10,
  },
  balance: {
    marginTop: '10%',
    color: '#fff',
    fontSize: 15,
    marginLeft: 10,
  },
  money: {
    color: '#fff',
    fontSize: 25,
    marginLeft: 10,
  },
  cardNr: {
    color: '#333',
    fontSize: 25,
    padding: 20,
    textAlign: 'center',
  },
  expDate: {
    color: '#333',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 42,
  },
  visible: {
    marginTop: '10%',
    marginLeft: '80%',
  },
  visa: {
    fontSize: 30,
    color: '#fff',
    marginLeft: '30%',
  },
  header: {
    flex: 1,
    marginLeft: 20,
  },
  listaConturi: {
    flex: 1,
    width: '100%',
    maxHeight: '100%',
  },
  contNouComponent: {
    margin: 20,
    height: 70,
    elevation: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  titluContNou: {
    flex: 0.3,
    backgroundColor: '#e29578',
    justifyContent: 'center',
    alignItems: 'center',
  },
  elementeContNou: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  soldContCurent: {
    fontSize: 20,
    marginRight: 30,
  },
  deschidereCont: {
    flex: 0.3,
    flexDirection: 'row',
  },
  textDeschidere: {
    marginLeft: 10,
  },
  trimite: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    backgroundColor: '#f07167',
    width: '100%',
    marginTop: 5,
    marginBottom: 5,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newAccountData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
