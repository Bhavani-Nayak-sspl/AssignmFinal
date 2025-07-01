import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { RootState, useAppDispatch, useAppSelector } from '../redux/store';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';


const ProfileScreen = () => {
  const { transactions } = useAppSelector((state: RootState) => state.transactions);
  const { theme, toggleTheme } = useTheme();

  // Theme colors
  const backgroundColor = theme === 'dark' ? '#121212' : '#f8f9fa';
  const textColor = theme === 'dark' ? '#ffffff' : '#212529';
  const cardBackground = theme === 'dark' ? '#333' : '#fff';
  const accentColor = theme === 'dark' ? '#F82' : '#F61';

  const exportTransactionsToCSV = async () => {
  if (transactions.length === 0) return;

  const header = 'ID,Type,Category,Amount,Description,Date\n';
  const csvRows = transactions.map(trans =>
    `${trans.id},${trans.type},${trans.category},${trans.amount},${trans.description},${trans.date}`
  );
  const csvString = header + csvRows.join('\n');

  const filePath = `${RNFS.DocumentDirectoryPath}/transactions.csv`;

  try {
    await RNFS.writeFile(filePath, csvString, 'utf8');
    await Share.open({
      url: 'file://' + filePath,
      type: 'text/csv',
      filename: 'transactions',
    });
  } catch (error : any) {
    console.log('CSV export error:', error);
    Alert.alert('CSV export error:', error)
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
        
        <Text style={[styles.profileName, { color: textColor }]}>Bhavani Nayak</Text>
        <Text style={[styles.profileTitle, { color: accentColor }]}>
          {transactions.length > 10 ? 'Premium' : 'Standard'}
        </Text>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: accentColor }]}>{transactions.length}</Text>
          <Text style={[styles.statLabel, { color: textColor }]}>Transactions</Text>
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
  onPress={exportTransactionsToCSV}
  style={[styles.themeButton, { backgroundColor: accentColor, marginTop: 16 }]}
  activeOpacity={0.8}
>
  <Icon 
    name="download-outline" 
    size={20} 
    color="#fff" 
  />
  <Text style={styles.themeButtonText}>
    Export CSV
  </Text>
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