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
const Reports = () => {
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('');
  const {accounts} = useSelector(state => state.transactionReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    getAccounts();
  }, []);
  //TO DO: SCHIMBA NUME_DC CU ACC_id PENTRU A FILTRA DUPA ID SI NU DUPA NUME LA TRANZACTII
  const getAccounts = async () => {
    try {
      const firebaseAccounts = await fetchData('conturi');
      dispatch(setNewAccounts(firebaseAccounts));
      // setAccountName(accounts.selectedAccount.Title);
    } catch (error) {
      console.error('Error fetching accounts: ', error);
    }
  };

  const handleAccountChange = value => {
    // perform filtering or other actions based on the selected account
  };
  const handleExcelExport = async () => {
    try {
      let transactions = [];
      if (selectedAccount === '') {
        transactions = await fetchTransactions('tranzactii');
      } else {
        transactions = await fetchTransactionsByAccount(
          'tranzactii',
          selectedAccount,
        );
      }

      const headers = [
        'Date',
        'Transaction Name',
        'Transaction Description',
        'Amount',
      ];
      const sortedTransactions = _.sortBy(transactions, transaction =>
        moment(transaction.Data, 'DD/MM/YYYY'),
      ).reverse();

      const data = [
        headers,
        ...sortedTransactions.map(t => [t.Data, t.Nume_DC, t.Desc, t.Suma]),
      ];
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
      const wbout = XLSX.write(wb, {type: 'base64', bookType: 'xlsx'});
      const fileUri = `${RNFS.DocumentDirectoryPath}/transactions.xlsx`;
      await RNFS.writeFile(fileUri, wbout, 'base64');
      console.log('Excel file created successfully');
      const shareOptions = {
        title: 'Exported Transactions',
        url: `file://${fileUri}`,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        social: Share.Social.EMAIL, // add this line
      };
      await Share.shareSingle(shareOptions);
      console.log('Excel file saved and shared successfully');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select an account:</Text>
      <DropDownPicker
        placeholder="Select an account"
        style={styles.dropdown}
        open={open}
        value={selectedAccount}
        items={accounts.map(account => ({
          label: [account.Title, ' - ', account.Sold, ' RON'],
          value: account.IBAN_cont,
          color: 'black', // add color here
        }))} // add unique keys here
        setOpen={setOpen}
        setValue={setSelectedAccount}
        onChangeValue={handleAccountChange}
        labelStyle={styles.dropdownLabel} // add this line
      />
      <TouchableOpacity style={styles.button} onPress={handleExcelExport}>
        <Text style={styles.text}>Export to Excel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    width: '80%',
  },
  dropdown: {
    color: 'black',
  },
  dropdownLabel: {
    color: 'black',
  },
});

export default Reports;
