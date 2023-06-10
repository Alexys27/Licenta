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
import {fetchTransactions} from './FirebaseFunctions';

export default function Budget({navigation}) {
  useEffect(() => {
    getTransactions();
  }, []);

  const [transactions, setTransactions] = useState([]);
  const [mancare, setMancare] = useState();
  const [chirie, setChirie] = useState();
  const [facturi, setFacturi] = useState();
  const [abonamente, setAbonamente] = useState();
  const [altele, setAltele] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    getTransactions();
    setRefreshing(false);
  };
  const getTransactions = async () => {
    try {
      const fetchedTransactions = await fetchTransactions('tranzactii');
      setTransactions(fetchedTransactions);

      let mancareTotal = 0;
      let chirieTotal = 0;
      let facturiTotal = 0;
      let abonamenteTotal = 0;
      let alteleTotal = 0;
      console.log(fetchedTransactions);
      fetchedTransactions.map(transaction => {
        if (
          transaction.Desc === 'transfer intre conturi proprii' &&
          transaction.este_plata === 'da'
        ) {
          mancareTotal += transaction.Suma;
        } else if (transaction.Desc === 'chirie') {
          chirieTotal += transaction.Suma;
        } else if (transaction.Desc === 'facturi') {
          facturiTotal += transaction.Suma;
        } else if (transaction.Desc === 'abonamente') {
          abonamenteTotal += transaction.Suma;
        } else if (transaction.Desc === 'altele') {
          alteleTotal += transaction.Suma;
        }
      });
      console.log(mancareTotal);
      console.log(chirieTotal);

      setMancare(mancareTotal);
      setChirie(chirieTotal);
      setFacturi(facturiTotal);
      setAbonamente(abonamenteTotal);
      setAltele(alteleTotal);
    } catch (error) {
      console.error('Error fetching transactions: ', error);
    }
  };

  const expensesData = [
    {category: 'mancare', amount: mancare, color: '#CCE3DE'},
    {category: 'chirie', amount: chirie, color: '#B8D3C8'},
    {category: 'facturi', amount: facturi, color: '#A4C3B2'},
    {category: 'abonamente', amount: abonamente, color: '#88AA99'},
    {category: 'altele', amount: altele, color: '#88AA99'},
  ];

  if (!expensesData || expensesData.length === 0) {
    // Handle the case when expensesData is undefined or empty
    return (
      <View style={styles.container}>
        <Text>No expenses data available</Text>
      </View>
    );
  }
  const totalAmount = expensesData.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  const renderItem = ({item}) => {
    const percentage = ((item.amount / totalAmount) * 100).toFixed(2);
    return (
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, {backgroundColor: item.color}]} />
        <Text
          style={styles.legendText}>{`${item.category} (${percentage}%)`}</Text>
      </View>
    );
  };

  return (
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
        <PieChart
          widthAndHeight={250}
          series={expensesData.map(expense => expense.amount)}
          sliceColor={['#CCE3DE', '#B8D3C8', '#A4C3B2', '#88AA99', '#88AA99']}
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerBuget: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textHeader: {
    fontSize: 30,
    color: '#6b9080',
    textAlign:'center',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
