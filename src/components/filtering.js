/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const Filtering = ({onFilterChange}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = query => {
    setSearchQuery(query);
    onFilterChange(query); // Pass the query to the parent component
  };

  return (
    <View style={styles.filterView}>

      <TextInput
        style={styles.filterInput}
        placeholder="Caută după nume/descriere"
        value={searchQuery}
        onChangeText={handleFilterChange}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  filterInput: {
    width: '80%',
    marginLeft: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'grey',
  },
  filterView: {
    padding: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterIcon:{
    marginLeft: 20,
  },
});

export default Filtering;
