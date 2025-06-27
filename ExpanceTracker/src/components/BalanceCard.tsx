import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

interface BalanceCardProps {
    totalBalance: number;
    totalExpense: number;
    totalRemainings: number;
}

const BalanceCard = (props: BalanceCardProps) => {
    const { totalBalance, totalExpense, totalRemainings } = props;
    
    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).replace('₹', '₹ ');
    };

    return (
        <View style={styles.container}>
            {/* Top Section - Total Balance */}
            <View style={styles.topView}>
                <Text style={styles.subHeading}>Track Your Budget</Text>
                <Text style={styles.totalBalance}>UserName</Text>
            </View>

            {/* Middle Section - Remaining Balance */}
            <View style={styles.middleView}>
                <Text style={styles.heading}>Remaining Balance</Text>
                <Text style={styles.balance}>{formatCurrency(totalRemainings)}</Text>
            </View>

            {/* Bottom Section - Expense Summary */}
            <View style={styles.bottomView}>
                <View style={styles.summaryItem}>
                    <Text style={styles.subHeading}>Total Income</Text>
                    <Text style={styles.positiveAmount}>{formatCurrency(totalBalance)}</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.subHeading}>Total Expense</Text>
                    <Text style={styles.negativeAmount}>{formatCurrency(totalExpense)}</Text>
                </View>
            </View>
        </View>
    );
};

export default BalanceCard;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#FFA726', // A nicer orange shade
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 5, // Adds shadow on Android
        shadowColor: '#000', // Adds shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginVertical: 10,
    },
    topView: {
        padding: 16,
        backgroundColor: '#FFB74D', // Lighter orange
        borderBottomWidth: 1,
        borderBottomColor: '#FFE0B2', // Very light orange
    },
    middleView: {
        padding: 16,
        backgroundColor: '#FFB74D', // Same as topView
        borderBottomWidth: 1,
        borderBottomColor: '#FFE0B2',
    },
    bottomView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFA726', // Same as container
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
        color: '#4CAF50', // Green for positive
        fontWeight: '600',
        marginTop: 5,
    },
    negativeAmount: {
        fontSize: 18,
        color: '#F44336', // Red for negative
        fontWeight: '600',
        marginTop: 5,
    },
});