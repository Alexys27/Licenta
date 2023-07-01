/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {fetchTransactionsByDate} from './FirebaseFunctions';
const TransactionsFilterModal = ({visible, onClose, onTransactionsFilter}) => {
  const [incasariSelected, setIncasariSelected] = useState(false);
  const [debitariSelected, setDebitariSelected] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('3 days');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromDatepicker, setShowFromDatepicker] = useState(false);
  const [showToDatepicker, setShowToDatepicker] = useState(false);
  const [transactionsByDate, setTransactionsByDate] = useState([]);

  const toggleIncasari = () => {
    setIncasariSelected(!incasariSelected);
  };

  const toggleDebitari = () => {
    setDebitariSelected(!debitariSelected);
  };

  const applyFilter = () => {
    // Manipulate the selected options and dates here
    console.log('Selected Options:', incasariSelected, debitariSelected);
    console.log('Selected Period:', selectedPeriod);
    console.log('From Date:', fromDate); //toLocalStringDate en-gb
    console.log('To Date:', toDate);
    handleFilterByDate();

    console.log(transactionsByDate);
    onClose();
  };
  const handleFilterByDate = async () => {
    const dataTranzactii = await fetchTransactionsByDate(
      'tranzactii',
      fromDate,
      toDate,
    );
    const filteredTransactions = filterTransactions(dataTranzactii);
    setTransactionsByDate(filteredTransactions);
    onTransactionsFilter(filteredTransactions);
  };
  const filterTransactions = transactions => {
    if (!incasariSelected && !debitariSelected) {
      // If neither option is selected, return all transactions
      return [];
    }
    return transactions.filter(transaction => {
      if (incasariSelected && !debitariSelected) {
        // Filter transactions for incasari (este_plata == 'nu')
        return transaction.este_plata === 'nu';
      } else if (!incasariSelected && debitariSelected) {
        // Filter transactions for debitari (este_plata == 'da')
        return transaction.este_plata === 'da';
      } else {
        // Filter transactions for both incasari and debitari
        return true;
      }
    });
  };
  const handleDateSelect = (event, selectedDate) => {
    if (selectedDate) {
      const currentDate = new Date(selectedDate);
      // const formattedDate = currentDate.toLocaleDateString('en-GB');

      if (showFromDatepicker) {
        if (currentDate <= new Date()) {
          setFromDate(currentDate);
        } else {
          // Display an error message or handle the invalid selection
          return;
        }
        setShowFromDatepicker(false);
      } else if (showToDatepicker) {
        if (
          new Date(currentDate) >= new Date(fromDate) &&
          new Date(currentDate) <= new Date()
        ) {
          setToDate(currentDate);
        } else {
          // Display an error message or handle the invalid selection
          return;
        }
        setShowToDatepicker(false);
      }
    } else {
      setShowFromDatepicker(false);
      setShowToDatepicker(false);
    }
  };

  const openFromDatepicker = () => {
    setShowFromDatepicker(true);
  };

  const openToDatepicker = () => {
    setShowToDatepicker(true);
  };

  const populateDateInputs = period => {
    const currentDate = new Date();
    let fromDate;
    let toDate = currentDate;

    if (selectedPeriod === period) {
      fromDate = '';
    } else {
      if (period === '3 days') {
        fromDate = new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000);
      } else if (period === '7 days') {
        fromDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (period === '30 days') {
        fromDate = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
    }

    setFromDate(fromDate);
    setToDate(toDate);
    setSelectedPeriod(period);
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={() => {
        setFromDate('');
        setToDate('');
        onClose;
      }}>
      <View style={styles.container}>
        <Text style={styles.title}>Filtrare tranzactii</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancelButton}>Anuleaza</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={applyFilter}>
          <Text style={styles.applyButton}>Aplica</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleIncasari}
          style={styles.optionContainer}>
          <Text style={styles.optionText}>
            {incasariSelected ? '✔' : ''} incasari
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleDebitari}
          style={styles.optionContainer}>
          <Text style={styles.optionText}>
            {debitariSelected ? '✔' : ''} debitari{' '}
          </Text>
        </TouchableOpacity>
        <View style={styles.periodContainer}>
          <TouchableOpacity
            onPress={() => populateDateInputs('3 days')}
            style={styles.periodOption}>
            <Text
              style={[
                styles.periodText,
                selectedPeriod === '3 days' && styles.selectedPeriodText,
              ]}>
              {selectedPeriod === '3 days' ? '✔' : ''} 3 days
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => populateDateInputs('7 days')}
            style={styles.periodOption}>
            <Text
              style={[
                styles.periodText,
                selectedPeriod === '7 days' && styles.selectedPeriodText,
              ]}>
              {selectedPeriod === '7 days' ? '✔' : ''} 7 days
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => populateDateInputs('30 days')}
            style={styles.periodOption}>
            <Text
              style={[
                styles.periodText,
                selectedPeriod === '30 days' && styles.selectedPeriodText,
              ]}>
              {selectedPeriod === '30 days' ? '✔' : ''} 30 days
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dateInputContainer}>
          <TouchableOpacity onPress={openFromDatepicker}>
            <TextInput
              style={styles.dateInput}
              placeholder="From Date"
              value={fromDate ? fromDate.toLocaleDateString('en-GB') : ''}
              editable={false}
            />
          </TouchableOpacity>
          {showFromDatepicker && (
            <DateTimePicker
              value={fromDate ? new Date(fromDate) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateSelect}
              maximumDate={new Date()} // Set maximum date to current date
            />
          )}
        </View>

        <View style={styles.dateInputContainer}>
          <TouchableOpacity onPress={openToDatepicker}>
            <TextInput
              style={styles.dateInput}
              placeholder="To Date"
              value={toDate ? toDate.toLocaleDateString('en-GB') : ''}
              editable={false}
            />
          </TouchableOpacity>
          {showToDatepicker && (
            <DateTimePicker
              value={toDate ? new Date(toDate) : new Date()}
              mode="date"
              display="default"
              minimumDate={fromDate ? new Date(fromDate) : new Date()}
              maximumDate={new Date()} // Set maximum date to current date
              onChange={handleDateSelect}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cancelButton: {
    fontSize: 16,
    color: 'red',
    marginBottom: 8,
  },
  applyButton: {
    fontSize: 16,
    color: 'green',
    marginBottom: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 8,
  },
  periodContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  periodOption: {
    marginRight: 16,
  },
  periodText: {
    fontSize: 16,
  },
  selectedPeriodText: {
    color: 'green',
  },

  dateInputContainer: {
    marginBottom: 16,
  },
  dateInput: {
    borderBottomWidth: 1,
    fontSize: 16,
  },
});
export default TransactionsFilterModal;

// Styles (you can customize these styles as needed)
