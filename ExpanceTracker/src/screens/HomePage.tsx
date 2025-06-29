import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Toast } from 'toastify-react-native';
import BalanceCard from '../components/BalanceCard';
import Form from '../components/Form';
import { useTheme } from '../components/ThemeProvider';
import { fetchTransactions } from '../redux/slices/transactionSlice';
import { RootState, useAppDispatch, useAppSelector } from '../redux/store';
import TransactionSummaryCard from '../components/TransactionSummaryCard';

interface Transaction {
  id: string;
  type: string;
  category: string;
  amount: number | string; // Allow string for JSON-parsed data
  description: string;
  date: string;
  createdAt: string;
}

const HomePage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark'; // Removed toggleTheme if unused
  const styles = getStyles(isDark);
  const [totalBalance, setTotalBalance] = useState<number>(0); // Default to 0
  const [totalExpense, setTotalExpense] = useState<number>(0); // Default to 0, fixed typo
  const [remainingBalance, setRemainingBalance] = useState<number>(0); // Default to 0, fixed naming
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
 

  const dispatch = useAppDispatch();
  const { transactions, loading, error } = useAppSelector(
    (state: RootState) => state.transactions,
  );

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Update balances when transactions change
  useEffect(() => {
    handleUpdateTransactions();
  }, [transactions]);

  const calculateTotalIncome = (transactions: Transaction[]): number => {
    return transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => {
        const amount = Number(transaction.amount); // Convert to number
        return isNaN(amount) ? total : total + amount;
      }, 0);
  };

  const calculateTotalExpense = (transactions: Transaction[]): number => {
    return transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => {
        const amount = Number(transaction.amount); // Convert to number
        return isNaN(amount) ? total : total + amount;
      }, 0);
  };

  const handleUpdateTransactions = () => {
    const income = calculateTotalIncome(transactions);
    const expense = calculateTotalExpense(transactions);
    setTotalBalance(income);
    setTotalExpense(expense);
    setRemainingBalance(income - expense); // Calculate remaining balance
  };

  return (
    <View style={styles.container}>
      <BalanceCard
        totalBalance={totalBalance}
        totalExpense={totalExpense}
        totalRemainings={remainingBalance} // Fixed naming
      />
      <View style={styles.seperator}>
        <Text style={styles.text}>Recent Transactions</Text> {/* Fixed typo */}
      </View>
      <TouchableOpacity
        style={styles.openModal}
        onPress={() => {
          Toast.success('Opening form'); // Simplified Toast
          setIsModalVisible(true);
        }}
      >
        <Icon name="plus" size={30} color="whitesmoke" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)} // Re-enabled for better UX
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Form closeModal={() => setIsModalVisible(false)} />
            <TouchableOpacity
              style={styles.closeModal}
              onPress={() => {
                Toast.success('Form closed');
                setIsModalVisible(false);
              }}
            >
              <Icon
                name="times"
                size={25}
                color={isDark ? '#AFAFAF' : '#494949'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TransactionSummaryCard/>
    </View>
  );
};

export default HomePage;

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 5,
      paddingVertical: 8,
      backgroundColor: isDark ? '#121212' : '#f5f5f5',
    },
    text: {
      color: isDark ? '#FFF' : '#000',
      fontSize: 16,
    },
    seperator: { // Fixed typo in variable name
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#444' : '#AAA',
      marginVertical: 10,
    },
    openModal: {
      height: 80,
      width: 80,
      backgroundColor: isDark ? '#FF9800' : '#FFA726',
      position: 'absolute',
      right: 10,
      bottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 40,
    },
    closeModal: {
      height: 20,
      width: 20,
      position: 'absolute',
      left: 15,
      top: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)',
      paddingHorizontal: 5,
    },
    modalView: {
      backgroundColor: isDark ? '#222' : '#FFF',
      width: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      borderRadius: 20,
    },
  });