import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from './ThemeProvider';

type Props = {

}
const TransactionSummaryCard = () => {
     const { theme } = useTheme();
      const isDark = theme === 'dark'; // Removed toggleTheme if unused
      const styles = getStyles(isDark);
  return (
    <View style={styles.container}>
      <Text>TransactionSummaryCard</Text>
      <Text>Description</Text>
      <View style={{flexDirection : 'row', justifyContent : 'space-around'}}>
        <Text>Date</Text>
        <Text> Time</Text>
      </View>
    </View>
  )
}

export default TransactionSummaryCard

const getStyles = (isDark: boolean) => StyleSheet.create({
    container :{
        width : '100%',
        height : '10%',
        backgroundColor: isDark ? '#121212' : 'grey',
        borderColor : '#EEE',
        borderWidth : 1,
        borderRadius : 20,
        elevation : 5,
        paddingHorizontal : 10,
        paddingVertical : 5,
        justifyContent : 'center'
    }
})