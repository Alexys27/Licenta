

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
        console.log(currentDate);
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
        console.log(currentDate);
      }
    }
  };
  const handleReset = () => {
    setFromDate('');
    setFilteredTransactions(transactions);
  };
<Button title="Cancel Filter" onPress={handleReset} />
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
{
  showPicker && (
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
          handleFilterByDate();
        }
      }}
    />
  );
}
