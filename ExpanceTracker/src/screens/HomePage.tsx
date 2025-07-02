import { Modal, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BalanceCard from '../components/BalanceCard';
import Form from '../components/Form';
import { useTheme } from '../components/ThemeProvider';
import { fetchTransactions } from '../redux/slices/transactionSlice';
import { RootState, useAppDispatch, useAppSelector } from '../redux/store';
import TransactionSummaryCard from '../components/TransactionSummaryCard';
import { Transaction } from '../types/navigation';
import { FlatList } from 'react-native';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomePage = () => {
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const styles = getStyles(isDark);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [remainingBalance, setRemainingBalance] = useState<number>(0);
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
      .filter(transaction => transaction.type === 'income')
      .reduce((total, transaction) => {
        const amount = Number(transaction.amount);
        return isNaN(amount) ? total : total + amount;
      }, 0);
  };

  const calculateTotalExpense = (transactions: Transaction[]): number => {
    return transactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((total, transaction) => {
        const amount = Number(transaction.amount);
        return isNaN(amount) ? total : total + amount;
      }, 0);
  };

  const handleUpdateTransactions = () => {
    const income = calculateTotalIncome(transactions);
    const expense = calculateTotalExpense(transactions);
    setTotalBalance(income);
    setTotalExpense(expense);
    setRemainingBalance(income - expense);
  };

  const filterLastSevenDaysTransactions = (
    transactions: Transaction[],)  => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    // First sort all transactions by newest first
    const sortedTransactions = [...transactions].sort((a, b) => {
      // Try createdAt first (for newly added transactions)
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      
      // Fallback to date                              
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      // If dates are equal, use ID or index as tiebreaker
      if (dateA.getTime() === dateB.getTime()) {
        // Assuming newer transactions have higher IDs or were added later
        return b.id.localeCompare(a.id);
      }
      
      return dateB.getTime() - dateA.getTime();
    });

    // Then filter for last 7 days
    return sortedTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= sevenDaysAgo && transactionDate <= now;
    });
  };

  const last7DaysTransactions = filterLastSevenDaysTransactions(transactions);

  return (
    <View style={styles.container}>
      <Header/>
      <BalanceCard
        totalBalance={totalBalance}
        totalExpense={totalExpense}
        totalRemainings={remainingBalance} 
      />
      <View style={styles.seperator}>
        <Text style={styles.text}>Recent Transactions</Text> 
      </View>
      {
        transactions.length > 0 ?(
<View style={{ flex: 1 }}>
        <FlatList
          data={last7DaysTransactions}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item }) => (
            <TransactionSummaryCard transaction={[item]} />
          )}
          contentContainerStyle={{paddingBottom: 80}}
         
        />
      </View>
        ) : (
          <View style={styles.emptyContainer}>
                   <Ionicons
                     name="wallet-outline"
                     size={32}
                     color={isDark ? '#555' : '#999'}
                   />
                   <Text style={styles.emptyText}>No transactions yet</Text>
                 </View>
        )
      }

      <TouchableOpacity
        style={styles.openModal}
        onPress={() => {
          setIsModalVisible(true);
        }}
      >
        <Icon name="plus" size={30} color="whitesmoke" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)} 
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Form closeModal={() => setIsModalVisible(false)} />
            <TouchableOpacity
              style={styles.closeModal}
              onPress={() => {
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
    seperator: {
      // Fixed typo in variable name
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#444' : '#AAA',
      marginVertical: 10,
    },
    openModal: {
      height: 60,
      width: 60,
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
     emptyContainer: {
      alignItems: 'center',
      paddingVertical: 16,
    },
    emptyText: {
      fontSize: 14,
      color: isDark ? '#AAA' : '#888',
      marginTop: 8,
    },
  });
