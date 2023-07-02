/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import PieChart from 'react-native-pie-chart';
import DropDownPicker from 'react-native-dropdown-picker';
import {fetchTransactionsByDate} from './FirebaseFunctions';

export default function Budget({navigation}) {
  const [transactions, setTransactions] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [open, setOpen] = useState(false);
  const monthOptions = [
    {label: 'Luna curenta', value: 0},
    {label: 'Cu 1 luna in urma', value: 1},
    {label: 'Cu 2 luni in urma', value: 2},
    // Add more options if needed
  ];

  useEffect(() => {
    if (selectedMonth !== null) {
      getTransactions();
    }
  }, [selectedMonth]);

  const onRefresh = () => {
    setRefreshing(true);
    getTransactions();
    setRefreshing(false);
  };

  const getTransactions = async () => {
    try {
      const currentDate = new Date();
      const selectedDate = new Date();
      selectedDate.setMonth(currentDate.getMonth() - selectedMonth);
      selectedDate.setDate(1);

      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - selectedMonth + 1,
        0,
      ).getDate();

      const fetchedTransactions = await fetchTransactionsByDate(
        'tranzactii',
        selectedDate,
        new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          lastDayOfMonth,
        ),
      );

      setTransactions(fetchedTransactions);

      const expensesByCategory = {};

      fetchedTransactions.forEach(transaction => {
        if (
          transaction.este_plata === 'da' &&
          typeof transaction.Desc === 'string' &&
          typeof transaction.Suma === 'number'
        ) {
          if (!expensesByCategory[transaction.Desc]) {
            expensesByCategory[transaction.Desc] = 0;
          }
          expensesByCategory[transaction.Desc] += transaction.Suma;
        }
      });

      const expensesData = Object.entries(expensesByCategory).map(
        ([category, amount]) => ({
          category,
          amount,
          color: getRandomColor(),
        }),
      );

      setExpensesData(expensesData);
    } catch (error) {
      console.error('Error fetching transactions: ', error);
      // Handle the error here
      setExpensesData([]);
    }
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const renderItem = ({item}) => {
    const totalAmount = expensesData.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    let percentage = 0;
    if (totalAmount !== 0) {
      percentage = ((item.amount / totalAmount) * 100).toFixed(2);
    }
    return (
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, {backgroundColor: item.color}]} />
        <Text
          style={styles.legendText}>{`${item.category} (${percentage}%)`}</Text>
      </View>
    );
  };

  return (
    <View style={styles.big}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.headerBuget}>
          <Text style={styles.textHeader}>
            Aici poti vedea raportul cheltuielilor tale
          </Text>
        </View>
        <View style={styles.container}>
          {expensesData.length > 0 ? (
            <>
              <PieChart
                widthAndHeight={250}
                series={expensesData.map(expense => expense.amount)}
                sliceColor={expensesData.map(expense => expense.color)}
                coverRadius={0.6}
                coverFill={'#FFF'}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
              <FlatList
                data={expensesData}
                renderItem={renderItem}
                keyExtractor={item => item.category}
                horizontal={true}
                contentContainerStyle={styles.legendContainer}
              />
            </>
          ) : (
            <Text style={styles.faraDate}>
              Nu exista date pentru perioada selectata
            </Text>
          )}
        </View>
      </ScrollView>
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          items={monthOptions}
          open={open}
          setOpen={setOpen}
          value={selectedMonth}
          containerStyle={{height: 40}}
          style={{backgroundColor: '#fafafa'}}
          itemStyle={{justifyContent: 'flex-start'}}
          dropDownStyle={{backgroundColor: '#fafafa'}}
          setValue={setSelectedMonth}
          onChangeItem={item => setSelectedMonth(item.value)}
          placeholder="Selecteaza luna"
          dropDownMaxHeight={150}
          zIndex={9999}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  big: {
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faraDate: {
    fontSize: 20,
    textAlign:'center',
    color:'red',
  },
  headerBuget: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textHeader: {
    fontSize: 30,
    color: '#6b9080',
    textAlign: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendContainer: {
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 20,
  },
});
