import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Alert, SectionList, TextInput } from 'react-native';
import { RootState, useAppDispatch, useAppSelector } from '../redux/store';
import { fetchTransactions, deleteTransaction } from '../redux/slices/transactionSlice';
import { Transaction } from '../types/navigation';
import TransactionSummaryCard from '../components/TransactionSummaryCard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from '../components/ThemeProvider';
import Form from '../components/Form';
import { Dropdown } from 'react-native-element-dropdown';

interface SectionData {
  title: string;
  data: Transaction[];
}

interface Category {
  label: string;
  value: string;
}

interface TransactionType {
  label: string;
  value: 'income' | 'expense' | 'all';
}

const History = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);
  const dispatch = useAppDispatch();
  const { transactions, loading, error } = useAppSelector((state: RootState) => state.transactions);

  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<TransactionType['value']>('all');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  useEffect(() => {
    applyFilters();
  }, [transactions, searchQuery, selectedCategory, selectedType]);

  const applyFilters = () => {
    let result = [...transactions];

    // Apply type filter
    if (selectedType !== 'all') {
      result = result.filter(transaction => transaction.type === selectedType);
    }

    // Apply category filter if selected
    if (selectedCategory) {
      result = result.filter(transaction => transaction.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(transaction => {
        // First try to match description
        if (transaction.description?.toLowerCase().includes(query)) {
          return true;
        }
        // Then try to match amount
        if (transaction.amount.toString().includes(query)) {
          return true;
        }
        return false;
      });
    }

    // Sort all transactions by date (newest first)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredTransactions(result);
  };

  const categories: Category[] = [
    { label: 'All Categories', value: '' },
    { label: 'Food', value: 'food' },
    { label: 'Transport', value: 'transport' },
    { label: 'Shopping', value: 'shopping' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Bills', value: 'bills' },
    { label: 'Health', value: 'health' },
    { label: 'Education', value: 'education' },
    { label: 'Salary', value: 'salary' },
    { label: 'Bonus', value: 'bonus' },
    { label: 'Investment', value: 'investment' },
    { label: 'Other', value: 'other' },
  ];

  const transactionTypes: TransactionType[] = [
    { label: 'All', value: 'all' },
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' },
  ];

const groupTransactionsByMonth = (transactions: Transaction[]): SectionData[] => {
  const grouped: { [key: string]: Transaction[] } = {};
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // First sort all transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => {
  const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
  if (dateDiff !== 0) return dateDiff;
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
});

  // Then group them by month
  sortedTransactions.forEach(transaction => {
    try {
      const date = new Date(transaction.date);
      if (isNaN(date.getTime())) throw new Error('Invalid date');
      const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      if (!grouped[monthYear]) grouped[monthYear] = [];
      grouped[monthYear].push(transaction);
    } catch (e) {
      console.error(`Invalid date for transaction ID ${transaction.id}:`, e);
    }
  });

  // Convert to array and sort sections by actual date (newest first)
  const sections = Object.keys(grouped)
    .map(monthYear => {
      const [monthName, year] = monthYear.split(' ');
      const monthIndex = monthNames.indexOf(monthName);
      const sectionDate = new Date(parseInt(year), monthIndex, 1);
      
      return {
        title: monthYear,
        data: grouped[monthYear],
        sortDate: sectionDate
      };
    })
    .sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime())
    .map(({ title, data }) => ({ title, data }));

  return sections;
};

  const groupedTransactions = groupTransactionsByMonth(filteredTransactions);

  const handleCardPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsActionModalVisible(true);
  };

  const handleEditPress = () => {
    setIsActionModalVisible(false);
    setIsEditModalVisible(true);

  };

  const handleDelete = () => {
    if (!selectedTransaction) return;
    setIsActionModalVisible(false);
    
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteTransaction(selectedTransaction.id)).unwrap();
            } catch (e) {
              console.error('Delete error:', e);
            }
          },
        },
      ],
    );
  };

  const renderSectionHeader = ({ section: { title } }: { section: SectionData }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const renderItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity onPress={() => handleCardPress(item)}>
      <TransactionSummaryCard transaction={[item]} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search and Filter Section */}
      <View style={styles.filterContainer}>
        <TextInput
          style={[styles.searchInput, isDark && styles.searchInputDark]}
          placeholder="Search by description or amount"
          placeholderTextColor={isDark ? '#999' : '#888'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <View style={styles.dropdownRow}>
          <Dropdown
            style={[styles.dropdown, isDark && styles.dropdownDark]}
            placeholderStyle={[styles.placeholderStyle, isDark && styles.placeholderStyleDark]}
            selectedTextStyle={[styles.selectedTextStyle, isDark && styles.selectedTextStyleDark]}
            inputSearchStyle={[styles.inputSearchStyle, isDark && styles.inputSearchStyleDark]}
            iconStyle={styles.iconStyle}
            data={transactionTypes}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select type"
            value={selectedType}
            onChange={item => setSelectedType(item.value)}
            renderLeftIcon={() => (
              <Icon 
                name={selectedType === 'income' ? 'arrow-up' : selectedType === 'expense' ? 'arrow-down' : 'exchange-alt'} 
                size={16} 
                color={isDark ? '#FFF' : '#000'} 
                style={styles.dropdownIcon}
              />
            )}
            containerStyle={isDark ? styles.dropdownContainerDark : styles.dropdownContainer}
          />
          
          <Dropdown
            style={[styles.dropdown, isDark && styles.dropdownDark]}
            placeholderStyle={[styles.placeholderStyle, isDark && styles.placeholderStyleDark]}
            selectedTextStyle={[styles.selectedTextStyle, isDark && styles.selectedTextStyleDark]}
            inputSearchStyle={[styles.inputSearchStyle, isDark && styles.inputSearchStyleDark]}
            iconStyle={styles.iconStyle}
            data={categories}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select category"
            searchPlaceholder="Search categories..."
            value={selectedCategory}
            onChange={item => setSelectedCategory(item.value || null)}
            renderLeftIcon={() => (
              <Icon 
                name="filter" 
                size={16} 
                color={isDark ? '#FFF' : '#000'} 
                style={styles.dropdownIcon}
              />
            )}
            containerStyle={isDark ? styles.dropdownContainerDark : styles.dropdownContainer}
          />
        </View>
      </View>

      {loading ? (
        <Text style={styles.text}>Loading transactions...</Text>
      ) : error ? (
        <Text style={styles.text}>Error: {error}</Text>
      ) : groupedTransactions.length === 0 ? (
        <Text style={styles.text}>No transactions found</Text>
      ) : (
        <SectionList
          sections={groupedTransactions}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ItemSeparatorComponent={() => <View style={styles.sectionSeparator} />}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Action Modal (Edit/Delete) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isActionModalVisible}
        onRequestClose={() => setIsActionModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.actionModalView}>
            <Text style={styles.modalTitle}>Choose Action</Text>
            
            <TouchableOpacity 
              style={[styles.actionModalButton, styles.editButton]}
              onPress={handleEditPress}
            >
              <Icon name="edit" size={18} color="#FFF" />
              <Text style={styles.actionModalButtonText}>Edit Transaction</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionModalButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Icon name="trash" size={18} color="#FFF" />
              <Text style={styles.actionModalButtonText}>Delete Transaction</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionModalButton, styles.cancelButton]}
              onPress={() => setIsActionModalVisible(false)}
            >
              <Text style={styles.actionModalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Modal - Now using Form component */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.editModalView}>
            {selectedTransaction && (
              <Form 
                closeModal={() => {
                  setIsEditModalVisible(false);
                  setSelectedTransaction(null);
                }}
                transactionToEdit={selectedTransaction}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: isDark ? '#121212' : '#f5f5f5',
  },
  text: {
    color: isDark ? '#FFF' : '#000',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  sectionHeader: {
    backgroundColor: isDark ? '#1E1E1E' : '#EEE',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#333' : '#DDD',
  },
  sectionHeaderText: {
    color: isDark ? '#FFF' : '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionSeparator: {
    height: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
  
  },
  actionModalView: {
    backgroundColor: isDark ? '#1E1E1E' : '#FFF',
    width: '100%',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal : 10,
    paddingTop : 15
    
  },
  editModalView: {
    backgroundColor: isDark ? '#1E1E1E' : '#FFF',
    width: '100%',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: isDark ? '#FFF' : '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  actionModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    gap: 10,
  },
  editButton: {
    backgroundColor: '#FFA726',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  cancelButton: {
    backgroundColor: isDark ? '#999' : '#333',
  },
  actionModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  filterContainer: {
    marginBottom: 16,
    gap: 12,
  },
  dropdownRow: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInput: {
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    color: '#000',
  },
  searchInputDark: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
    color: '#FFF',
  },
  dropdown: {
    flex: 1,
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
  dropdownDark: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
  },
  dropdownContainer: {
    backgroundColor: '#FFF',
    borderColor: '#DDD',
    borderRadius: 8,
  },
  dropdownContainerDark: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#888',
  },
  placeholderStyleDark: {
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  selectedTextStyleDark: {
    color: '#FFF',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    backgroundColor: '#FFF',
    color: '#000',
  },
  inputSearchStyleDark: {
    backgroundColor: '#1E1E1E',
    color: '#FFF',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  dropdownIcon: {
    marginRight: 10,
  },
});

export default History;