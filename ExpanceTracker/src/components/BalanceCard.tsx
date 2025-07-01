import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useMemo, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from './ThemeProvider';
import { RootState, useAppDispatch, useAppSelector } from '../redux/store';
import { BarChart, EdgePosition, PieChart } from 'react-native-gifted-charts';
import * as Progress from 'react-native-progress';

interface BalanceCardProps {
  totalBalance: number;
  totalExpense: number;
  totalRemainings: number;
}

const BalanceCard = (props: BalanceCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);
  const dispatch = useAppDispatch();
  const { transactions, loading, error } = useAppSelector(
    (state: RootState) => state.transactions,
  );
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [filter, setFilter] = useState<'month' | 'week' | 'all'>('month');
  const { totalBalance, totalExpense, totalRemainings } = props;

  const formatCurrency = (amount: number) => {
    return amount
      .toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      })
      .replace('₹', '₹ ');
  };

  // Filter transactions based on selected filter
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      if (filter === 'week') {
        const oneWeekAgo = new Date(currentDate);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return transactionDate >= oneWeekAgo;
      } else if (filter === 'month') {
        const oneMonthAgo = new Date(currentDate);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return transactionDate >= oneMonthAgo;
      }
      return true; // 'all' filter
    });
  }, [transactions, filter]);

  // Prepare data for category-wise spending chart
  const categoryData = useMemo(() => {
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    
    const categoryMap: Record<string, number> = {};
    
    expenseTransactions.forEach(transaction => {
      if (!categoryMap[transaction.category]) {
        categoryMap[transaction.category] = 0;
      }
      categoryMap[transaction.category] += transaction.amount;
    });
    
    return Object.entries(categoryMap).map(([category, amount]) => ({
      value: amount,
      label: category,
      frontColor: getRandomColor(),
    }));
  }, [filteredTransactions]);

  // Prepare data for pie chart
  const pieData = useMemo(() => {
    return categoryData.map(item => ({
      value: item.value,
      color: item.frontColor,
      text: item.label,
    }));
  }, [categoryData]);

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  useEffect(()=>{
    budgetTrackingInPercentage()
  },[totalExpense])

  function budgetTrackingInPercentage () {
    const totalUsedAmountInPercentage = (totalExpense / totalBalance * 100).toFixed(2);
    if(Number(totalUsedAmountInPercentage) > 80){
      Alert.alert(`You have used ${totalUsedAmountInPercentage}% of your budget. Please be careful!`);
    }
  }

  // Calculate progress for the progress bar
  const progress = totalBalance > 0 ? totalExpense / totalBalance : 0;

  return (
    <View style={styles.container}>
      {/* Top Section - Total Balance */}
      <View style={styles.topView}>
        <Text style={styles.subHeading}>Track Your Budget</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarContainer}>
            <Progress.Bar 
              progress={progress} 
              width={null} 
              height={20}
              color="#4CAF50"
              unfilledColor="#f0f0f0"
              borderWidth={0}
              borderRadius={10}
              animated={true}
            />
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}> Used: {totalBalance > 0 ? (totalExpense / totalBalance * 100).toFixed(2) : 0}% of your budget
            </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Middle Section - Remaining Balance */}
      <View style={styles.middleView}>
        <View>
          <Text style={styles.heading}>Remaining Balance</Text>
          <Text style={styles.balance}>{formatCurrency(totalRemainings)}</Text>
        </View>
        <TouchableOpacity
          style={styles.chartButton}
          onPress={() => setIsActionModalVisible(!isActionModalVisible)}
        >
          <Icon name="stats-chart-sharp" color={'#888'} size={20} />
          <Text style={styles.subHeading}>Statistics</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Section - Expense Summary */}
      <View style={styles.bottomView}>
        <View style={styles.summaryItem}>
          <Text style={styles.subHeading}>Total Income</Text>
          <Text style={styles.positiveAmount}>
            {formatCurrency(totalBalance)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.subHeading}>Total Expense</Text>
          <Text style={styles.negativeAmount}>
            {formatCurrency(totalExpense)}
          </Text>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={isActionModalVisible}
        onRequestClose={() => {
          setIsActionModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Spending Statistics</Text>
            <TouchableOpacity onPress={() => setIsActionModalVisible(false)}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.filterContainer}>
            <TouchableOpacity 
              style={[styles.filterButton, filter === 'week' && styles.activeFilter]}
              onPress={() => setFilter('week')}
            >
              <Text style={styles.filterText}>Last 7 Days</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, filter === 'month' && styles.activeFilter]}
              onPress={() => setFilter('month')}
            >
              <Text style={styles.filterText}>This Month</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
              onPress={() => setFilter('all')}
            >
              <Text style={styles.filterText}>All Time</Text>
            </TouchableOpacity>
          </View>
          
          {categoryData.length > 0 ? (
            <>
              <Text style={styles.chartTitle}>Category-wise Spending</Text>
              <BarChart
                barWidth={22}
                noOfSections={4}
                barBorderRadius={4}
                frontColor="lightgray"
                data={categoryData}
                yAxisThickness={0}
                xAxisThickness={0}
                showYAxisIndices
                yAxisTextStyle={{color: '#666'}}
                xAxisLabelTextStyle={{color: '#000', textAlign: 'center',}}
                labelWidth={20}
                // showLine
                lineConfig={{
                  color: '#FFA726',
                  thickness: 3,
                  curved: true,
                  hideDataPoints: true,
                  shiftY: 20,
                  initialSpacing: -30,
                }}
              />
              
              <Text style={styles.chartTitle}>Spending Distribution</Text>
              <View style={styles.pieChartContainer}>
                <PieChart
                  data={pieData}
                  donut
                  showGradient
                  sectionAutoFocus
                  radius={90}
                  innerRadius={60}
                  innerCircleColor={'#f8f8f8'}
                  centerLabelComponent={() => (
                    <View style={styles.pieCenterLabel}>
                      <Text style={styles.pieCenterText}>
                        {formatCurrency(categoryData.reduce((sum, item) => sum + item.value, 0))}
                      </Text>
                      <Text style={styles.pieCenterSubText}>Total</Text>
                    </View>
                  )}
                />
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Icon name="alert-circle-outline" size={40} color="#888" />
              <Text style={styles.emptyText}>No expense data available</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default BalanceCard;

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      width: '100%',
      backgroundColor: '#FFA726',
      borderRadius: 20,
      overflow: 'hidden',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      marginVertical: 10,
    },
    chartButton: {
      backgroundColor: '#dcdcdc',
      paddingHorizontal: 8,
      paddingVertical: 5,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    topView: {
      padding: 16,
      backgroundColor: '#FFB74D',
      borderBottomWidth: 1,
      borderBottomColor: '#FFE0B2',
    },
    middleView: {
      padding: 16,
      backgroundColor: '#FFB74D',
      borderBottomWidth: 1,
      borderBottomColor: '#FFE0B2',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    bottomView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: '#FFA726',
    },
    summaryItem: {
      alignItems: 'center',
      flex: 1,
    },
    heading: {
      fontSize: 18,
      color: '#666',
      fontWeight: '600',
      marginBottom: 5,
    },
    subHeading: {
      fontSize: 14,
      color: '#666',
      fontWeight: '500',
      opacity: 0.9,
    },
    totalBalance: {
      fontSize: 28,
      color: '#444',
      fontWeight: '700',
    },
    balance: {
      fontSize: 24,
      color: '#444',
      fontWeight: '600',
    },
    positiveAmount: {
      fontSize: 18,
      color: '#4CAF50',
      fontWeight: '600',
      marginTop: 5,
    },
    negativeAmount: {
      fontSize: 18,
      color: '#F44336',
      fontWeight: '600',
      marginTop: 5,
    },
    progressContainer: {
      marginTop: 10,
    },
    progressBarContainer: {
      position: 'relative',
      width: '100%',
    },
    progressTextContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    progressText: {
      fontSize: 12,
      color: '#444',
      fontWeight: '600',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: '#f8f8f8',
      padding: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#444',
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    filterButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: '#e0e0e0',
    },
    activeFilter: {
      backgroundColor: '#FFA726',
    },
    filterText: {
      color: '#666',
      fontWeight: '500',
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#444',
      marginTop: 20,
      marginBottom: 10,
      textAlign: 'center',
    },
    pieChartContainer: {
      alignItems: 'center',
      marginVertical: 20,
    },
    pieCenterLabel: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    pieCenterText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#444',
    },
    pieCenterSubText: {
      fontSize: 12,
      color: '#666',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
    },
    emptyText: {
      fontSize: 16,
      color: '#888',
    },
  });