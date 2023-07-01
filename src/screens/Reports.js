/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {setNewAccounts} from '../../redux/actions';
import {
  fetchData,
  fetchTransactions,
  fetchTransactionsByAccount,
} from './FirebaseFunctions';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import _ from 'lodash';
import moment from 'moment';
import Filtering from '../components/filtering';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const Reports = () => {
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('');
  const {accounts} = useSelector(state => state.transactionReducer);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getAccounts();
  }, []);

  const getAccounts = async () => {
    try {
      const firebaseAccounts = await fetchData('conturi');
      dispatch(setNewAccounts(firebaseAccounts));
    } catch (error) {
      console.error('Error fetching accounts: ', error);
    }
  };

  const handleAccountChange = value => {
    setSelectedAccount(value);

  };

  const handleExcelExport = async () => {
    try {
      let transactions = [];

      if (selectedAccount === 'RO60RZBR6797844255437327') {
        transactions = await fetchTransactions('tranzactii');
      } else {
        transactions = await fetchTransactionsByAccount(
          'tranzactii',
          selectedAccount,
        );
      }

      let filteredData = [];
      if (selectedAccount === 'RO60RZBR6797844255437327') {
        // Filter transactions by query in 'Nume_DC' or 'Desc'
        filteredData = transactions.filter(
          transaction =>
            transaction.Nume_DC.includes(searchQuery) ||
            transaction.Desc.includes(searchQuery),
        );
      } else {
        // Filter transactions by query and selected account
        filteredData = transactions.filter(
          transaction =>
            transaction.Nume_DC.includes(searchQuery) ||
            (transaction.Desc.includes(searchQuery) &&
              transaction.IBAN_cont === selectedAccount),
        );
      }

      const headers = ['Data', 'Nume', 'Descriere', 'Suma', 'Plata'];
      const sortedTransactions = _.sortBy(filteredData, transaction =>
        moment(transaction.Data, 'DD/MM/YYYY'),
      ).reverse();

      const data = [
        headers,
        ...sortedTransactions.map(t => [
          t.Data,
          t.Nume_DC,
          t.Desc,
          t.Suma,
          t.este_plata,
        ]),
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
      const wbout = XLSX.write(wb, {type: 'base64', bookType: 'xlsx'});
      const fileUri = `${RNFS.DocumentDirectoryPath}/transactions.xlsx`;
      await RNFS.writeFile(fileUri, wbout, 'base64');

      const shareOptions = {
        title: 'Exported Transactions',
        url: `file://${fileUri}`,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        social: Share.Social.EMAIL,
      };
      await Share.shareSingle(shareOptions);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selecteaza un cont:</Text>
      <DropDownPicker
        placeholder="Selectează contul dorit"
        style={styles.dropdown}
        containerStyle={styles.containerStyle}
        open={open}
        value={selectedAccount}
        items={accounts.map(account => ({
          label: [
            account.Title,
            ' - ',
            parseFloat(account.Sold.toFixed(2)),
            ' RON',
          ],
          value: account.IBAN_cont,
          color: 'black',
        }))}
        setOpen={setOpen}
        setValue={setSelectedAccount}
        onChangeValue={handleAccountChange}
        labelStyle={styles.dropdownLabel}
      />
      <Text style={styles.label}> Filtrează:</Text>
      <View style={styles.FilterView}>
        <TouchableOpacity>
          <FontAwesome5Icon
            style={styles.filterIcon}
            name="filter"
            size={20}
            color={'#e29578'}
          />
        </TouchableOpacity>
        <Filtering
          onFilterChange={setSearchQuery}
          placeholder="Search by name or description"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleExcelExport}>
        <Text style={styles.text}>Generare extras de cont (excel)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  containerStyle: {
    zIndex: 9999,
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    color: '#83c5be',
    margin: 10,
    fontWeight: 'bold',
  },
  dropdown: {
    color: 'black',
    borderWidth: 0.3,
    elevation: 20,
    padding: 20,
    borderColor: '#e29578',
  },
  dropdownLabel: {
    color: 'black',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#83c5be',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  FilterView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 40,
  },
});

export default Reports;
