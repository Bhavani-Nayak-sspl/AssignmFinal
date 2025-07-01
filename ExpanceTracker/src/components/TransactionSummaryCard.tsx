import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTheme } from './ThemeProvider';
import { Transaction } from '../types/navigation';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Add icon library

type Props = {
  transaction: Transaction[];
};

const TransactionSummaryCard = ({ transaction }: Props) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);

  // Format date to a readable format (e.g., "Oct 5, 2023")
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format time (e.g., "2:30 PM")
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get icon and color based on transaction type/category
  const getTransactionIcon = (type: 'expense' | 'income', category: string) => {
    if (type === 'income') return { name: 'cash-outline', color: '#4CAF50' };
    switch (category.toLowerCase()) {
      case 'food':
        return { name: 'fast-food-outline', color: '#FF5722' };
      case 'transport':
        return { name: 'car-outline', color: '#2196F3' };
      case 'shopping':
        return { name: 'cart-outline', color: '#E91E63' };
      case 'bills':
        return { name: 'newspaper-outline', color: '#88F' };
      default:
        return { name: 'wallet-outline', color: '#F44' };
    }
  };

  return (
    <View style={styles.container}>

      {transaction.length > 0 ? (
        <View style={styles.transactionContainer}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons
              name={getTransactionIcon(transaction[0].type, transaction[0].category).name}
              size={24}
              color={getTransactionIcon(transaction[0].type, transaction[0].category).color}
            />
          </View>

          {/* Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.category}>
              {transaction[0].category}
            </Text>
            <Text style={styles.description} numberOfLines={1}>
              {transaction[0].description ? transaction[0].description : 'No description'}
            </Text>
          </View>

          {/* Amount */}
          <Text
            style={[
              styles.amount,
              transaction[0].type === 'income' ? styles.income : styles.expense,
            ]}
          >
            {transaction[0].type === 'income' ? '+' : '-'}
            ₹ {transaction[0].amount.toFixed(2)}
          </Text>
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
      )}

      {/* Footer with creation time */}
      {transaction.length > 0 && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.footerText}>{formatDate(transaction[0].date)}</Text>
          <Text style={styles.footerText}>
            Added on {formatTime(transaction[0].createdAt)}
          </Text>
        </View>
      )}
    </View>
  );
};

export default TransactionSummaryCard;

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      width: '100%',
      backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
      borderColor: isDark ? '#333' : '#EEE',
      borderWidth: 1,
      borderRadius: 12,
      elevation: 3,
      padding: 16,
      marginVertical: 8,
      shadowColor: isDark ? '#000' : 'rgba(0,0,0,0.1)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
    },
    transactionContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    detailsContainer: {
      flex: 1,
    },
    category: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#AAA' : '#666',
      marginBottom: 2,
      textTransform : 'capitalize',
    },
    description: {
      fontSize: 12,
      color: isDark ? '#FFF' : '#333',
      marginBottom: 2,
    },
    amount: {
      fontSize: 16,
      fontWeight: '600',
    },
    income: {
      color: '#4CAF50', // Green for income
    },
    expense: {
      color: '#F44336', // Red for expense
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
    footerText: {
      fontSize: 10,
      color: isDark ? '#555' : '#999',
      textAlign: 'right',
      marginTop: 4,
    },
  });
