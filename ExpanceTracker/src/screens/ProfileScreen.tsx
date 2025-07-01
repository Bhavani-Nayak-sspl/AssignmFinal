import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { RootState, useAppDispatch, useAppSelector } from '../redux/store';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

// Define transaction type (adjust this based on your actual transaction structure)
interface Transaction {
  id: string | number;
  amount: number;
  description: string;
  date: string;
  category?: string;
  type?: 'income' | 'expense';
  [key: string]: any; // Allow for additional properties
}

const ProfileScreen = () => {
  const { transactions } = useAppSelector(
    (state: RootState) => state.transactions,
  );
  const { theme, toggleTheme } = useTheme();

  // Theme colors
  const backgroundColor = theme === 'dark' ? '#121212' : '#f8f9fa';
  const textColor = theme === 'dark' ? '#ffffff' : '#212529';
  const cardBackground = theme === 'dark' ? '#333' : '#fff';
  const accentColor = theme === 'dark' ? '#F82' : '#F61';

  // Function to convert transactions to CSV format
  const convertToCSV = (data: Transaction[]): string => {
    if (!data || data.length === 0) {
      return 'No data available';
    }
    
    // Get all unique keys from all transactions to create headers
    const allKeys = new Set<string>();
    data.forEach((transaction: Transaction) => {
      Object.keys(transaction).forEach((key: string) => allKeys.add(key));
    });

    const headers = Array.from(allKeys);
    
    // Create CSV header row
    const csvHeaders = headers.join(',');
    
    // Create CSV data rows
    const csvRows = data.map((transaction: Transaction) => {
      return headers.map((header: string) => {
        const value = transaction[header];
        // Handle values that might contain commas, quotes, or newlines
        if (value === null || value === undefined) {
          return '';
        }
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
  };

  // Function to handle CSV export with download option
  const handleExportCSV = async () => {
    try {
      if (!transactions || transactions.length === 0) {
        Alert.alert('No Data', 'No transactions available to export.');
        return;
      }

      // Show options to user
      Alert.alert(
        'Export Options',
        'How would you like to export your transactions?',
        [
          {
            text: 'Download to Device',
            onPress: () => downloadCSV(),
          },
          {
            text: 'Share File',
            onPress: () => shareCSV(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );

    } catch (error) {
      console.error('Export error:', error);
      Alert.alert(
        'Export Failed', 
        'Failed to export transactions. Please try again.'
      );
    }
  };

  // Function to download CSV directly to Downloads folder
  const downloadCSV = async () => {
    try {
      // Convert transactions to CSV
      const csvContent = convertToCSV(transactions);
      
      // Create filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `transactions_${timestamp}.csv`;
      
      // Try to save to Downloads folder (Android) or Documents (iOS)
      const downloadPath = Platform.OS === 'android' 
        ? `${RNFS.DownloadDirectoryPath}/${fileName}`
        : `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // Write CSV to file
      await RNFS.writeFile(downloadPath, csvContent, 'utf8');

      Alert.alert(
        'Download Complete!', 
        `File saved successfully!\n\nLocation: ${Platform.OS === 'android' ? 'Downloads' : 'Documents'} folder\nFilename: ${fileName}`,
        [{ text: 'OK', style: 'default' }]
      );

    } catch (error) {
      console.error('Download error:', error);
      Alert.alert(
        'Download Failed', 
        'Failed to download file. Trying alternative method...',
        [
          {
            text: 'Try Share Instead',
            onPress: () => shareCSV(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  };

  // Function to share CSV file
  const shareCSV = async () => {
    try {
      // Convert transactions to CSV
      const csvContent = convertToCSV(transactions);
      
      // Create filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `transactions_${timestamp}.csv`;
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // Write CSV to file
      await RNFS.writeFile(filePath, csvContent, 'utf8');

      // Share the file
      const shareOptions = {
        title: 'Export Transactions',
        message: 'Your transactions data',
        url: `file://${filePath}`,
        type: 'text/csv',
        filename: fileName,
      };

      await Share.open(shareOptions);

    } catch (error) {
      console.error('Share error:', error);
      Alert.alert(
        'Share Failed', 
        'Failed to share file. Please try again.'
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.profileCard, { backgroundColor: cardBackground }]}>
        <Icon
          name="person-circle-outline"
          size={80}
          color={accentColor}
          style={styles.profileIcon}
        />
        
        <Text style={[styles.profileName, { color: textColor }]}>
          Bhavani Nayak
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: accentColor }]}>
            {transactions.length}
          </Text>
          <Text style={[styles.statLabel, { color: textColor }]}>
            Transactions
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={toggleTheme}
        style={[styles.themeButton, { backgroundColor: accentColor }]}
        activeOpacity={0.8}
      >
        <Icon
          name={theme === 'dark' ? 'sunny' : 'moon'}
          size={20}
          color="#fff"
        />
        <Text style={styles.themeButtonText}>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={handleExportCSV}
        style={[
          styles.themeButton,
          { backgroundColor: accentColor, marginTop: 16 },
        ]}
        activeOpacity={0.8}
      >
        <Icon name="download-outline" size={20} color="#fff" />
        <Text style={styles.themeButtonText}>Export CSV</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  profileCard: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
  },
  profileIcon: {
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileTitle: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    padding: 12,
    minWidth: 100,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  themeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
});

export default ProfileScreen;