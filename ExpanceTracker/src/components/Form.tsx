import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Toast } from 'toastify-react-native';
import { useAppDispatch } from '../redux/store';
import { addTransaction } from '../redux/slices/transactionSlice';

const transactionTypes = [
  { label: 'Expense', value: 'expense' },
  { label: 'Income', value: 'income' },
];
type FormProps = {
  closeModal: () => void;
};

const categories = {
  expense: [
    { label: 'Food', value: 'food' },
    { label: 'Transport', value: 'transport' },
    { label: 'Shopping', value: 'shopping' },
    { label: 'Bills', value: 'bills' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Other', value: 'other_expense' },
  ],
  income: [
    { label: 'Salary', value: 'salary' },
    { label: 'Bonus', value: 'bonus' },
    { label: 'Investment', value: 'investment' },
    { label: 'Gift', value: 'gift' },
    { label: 'Other', value: 'other_income' },
  ]
};

const Form = ({closeModal} : FormProps) => {
  const [type, setType] = useState(null);
  const [category, setCategory] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
    const dispatch = useAppDispatch()


   const handleSubmit = async () => {
  // Validation
  if (!type) {
    Toast.error('Please select a transaction type');
    return;
  }

  if (!category) {
    Toast.error('Please select a category');
    return;
  }

  const amountValue = parseFloat(amount);
  if (isNaN(amountValue) || amountValue <= 0) {
    Toast.error('Please enter a valid amount');
    return;
  }

const transaction = {
    type,
    category,
    amount: amountValue,
    description,
    date: date.toISOString().split('T')[0],
  };

console.log(transaction,'in handle submit')
console.log(date.toISOString().split('T')[0],'DAte in handle submit')
   try {
    await dispatch(addTransaction(transaction)).unwrap();
    
    // Reset form
    setType(null);
    setCategory(null);
    setAmount('');
    setDescription('');
    setDate(new Date());
    closeModal()
  } catch (error : any) {
    Toast.error(error.message || 'Failed to save transaction');
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add Transaction</Text>

      {/* Transaction Type Dropdown */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Transaction Type</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={transactionTypes}
          labelField="label"
          valueField="value"
          placeholder="Select Type"
          value={type}
          onChange={item => {
            setType(item.value);
            setCategory(null);
          }}
          renderLeftIcon={() => (
            <Icon name="swap-vert" size={20} color="#6c63ff" style={styles.icon} />
          )}
          containerStyle={styles.dropdownContainer}
          itemTextStyle={styles.dropdownItemText}
          activeColor="#f0f0f0"
        />
      </View>

      {/* Category Dropdown */}
      {type && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={categories[type]}
            labelField="label"
            valueField="value"
            placeholder="Select Category"
            value={category}
            onChange={item => setCategory(item.value)}
            renderLeftIcon={() => (
              <Icon name="category" size={20} color="#6c63ff" style={styles.icon} />
            )}
            containerStyle={styles.dropdownContainer}
            itemTextStyle={styles.dropdownItemText}
            activeColor="#f0f0f0"
          />
        </View>
      )}

      {/* Amount Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Amount</Text>
        <View style={styles.amountContainer}>
          <Icon name="attach-money" size={24} color="#6c63ff" style={styles.currencyIcon} />
          <TextInput
            style={styles.amountInput}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor="#aaa"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
      </View>

      {/* Description Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>
        <View style={styles.descriptionContainer}>
          <Icon name="description" size={20} color="#6c63ff" style={styles.icon} />
          <TextInput
            style={styles.descriptionInput}
            placeholder="Optional description"
            placeholderTextColor="#aaa"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={50}
          />
        </View>
      </View>

      {/* Date Picker */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.dateContainer}
          onPress={() => setShowDatePicker(true)}
        >
          <Icon name="event" size={20} color="#6c63ff" style={styles.icon} />
          <Text style={styles.dateText}>
            {date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            // onChange={onDateChange}
            accentColor="#6c63ff"
          />
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          (!type || !category || !amount) && styles.disabledButton
        ]}
        onPress={handleSubmit}
        disabled={!type || !category || !amount}
      >
        <Text style={styles.submitButtonText}>Add Transaction</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Form;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
    fontWeight: '600',
  },
  dropdown: {
    height: 55,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#aaa',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  icon: {
    marginRight: 10,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currencyIcon: {
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    height: 55,
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: '500',
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical : 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    // minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  descriptionInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    paddingVertical: 12,
    lineHeight: 22,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  submitButton: {
    backgroundColor: '#6c63ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#6c63ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
