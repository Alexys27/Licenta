/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Alert,
  FlatList,
  Modal,
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
import {setTransactions, setAccID, setNewAccounts} from '../../redux/actions';
import {fetchData, addData} from './FirebaseFunctions';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
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
  const [viewCardNumber, setViewCardNumber] = useState(false);
  const [sold, setSold] = useState(6000);
  const [soldContNou, setSoldContNou] = useState(2000);
  const [titluContNou, setTitluContNou] = useState('Cont Nou');
  const [showTransferForm, setShowForm] = useState(false);
  const {accounts} = useSelector(state => state.transactionReducer);
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


  //preluare conturi
  const getAccounts = async () => {
    try {
      const firebaseAccounts = await fetchData('conturi');
      dispatch(setNewAccounts(firebaseAccounts));
    } catch (error) {
      console.error('Error fetching accounts: ', error);
    }
  };
//setare conturi
  const setAccounts = () => {
    try {
      const Account = {
        Title: titluContNou,
        Sold: soldContNou,
        DataCreare: data,
        ID_utilizator: 1,
        IBAN_cont: generateRomanianIBAN(),
      };
      const newAccounts = [...accounts, Account];
      AsyncStorage.setItem('Accounts', JSON.stringify(newAccounts))
        .then(() => {
          dispatch(setNewAccounts(newAccounts));
          addData('conturi', Account);
          Alert.alert('Succes!', 'Contul a fost creat cu succes.');
        })
        .catch(err => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  //functie pentru apasarea butonului necesar crearii unui cont nou
  const onPressNewAccount = async () => {
    dispatch(setAccID(accounts.length + 1));
    setShowForm(true);
  };

  return (
    <SafeAreaView style={styles.mainView}>
      <Text style={styles.balance}>SOLD</Text>
      <Text style={styles.money}>{sold} RON</Text>
      <LinearGradient
        colors={['#f7b267', '#f27059', '#f25c54']}
        style={styles.cardView}>
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
              } else {
                setCardNumber('XXXX XXXX XXXX 1445');
                setViewCardNumber(false);
              }
            }}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.cardNr}>{cardNumber}</Text>
          <View style={styles.importantData}>
            <Text style={styles.expDate}>EXP: {'05/27'}</Text>
            <Text style={styles.cvv}>CVV {'566'}</Text>

            <FontAwesome5
              style={styles.visa}
              name="cc-visa"
              size={20}
              color={'#333'}
            />
          </View>
        </View>
      </LinearGradient>
      <View style={styles.secondView}>
        <FlatList
          style={styles.listaConturi}
          data={accounts}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{paddingBottom: 10}}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.contNouComponent}>
              <View style={styles.titluContNou}>
                <Text>{item.Title}</Text>
              </View>
              <View style={styles.elementeContNou}>
                <Text style={styles.soldContCurent}>{item.Sold} RON</Text>
              </View>
            </TouchableOpacity>
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
          onRequestClose={() => setShowForm(false)}
          visible={showTransferForm}>
          <View style={styles.newAccountData}>
            <TextInput
              placeholder="Tip Cont"
              onChangeText={value => setTitluContNou(value)}
            />
            <TextInput
              placeholder="Sold"
              onChangeText={value => setSoldContNou(value)}
            />
            <View style={styles.trimite}>
              <TouchableOpacity style={styles.sendButton} onPress={setAccounts}>
                <Text>Trimite</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-end',
  },
  secondView: {
    flex: 1,
    marginTop: '10%',
    backgroundColor: '#f5f3f4',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    alignItems: 'center',
  },
  cardView: {
    flex: 0.6,
    borderRadius: 25,
    marginTop: '5%',
    marginRight: '5%',
    marginLeft: '5%',
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
    backgroundColor: 'yellow',
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
    marginTop: '10%',
    marginBottom: '10%',
  },
  sendButton: {
    flex: 0.3,
    backgroundColor: '#f07167',
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  newAccountData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
