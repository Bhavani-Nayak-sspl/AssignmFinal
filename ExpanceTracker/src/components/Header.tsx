import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTheme } from './ThemeProvider';

const Header = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Expense Tracker</Text>
      </View>
    </View>
  );
};

export default Header;

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    height: 40,
    backgroundColor: isDark ? '#F94' : '#E61',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: isDark ? '#fff' : '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderRadius  : 5
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    color: isDark ? '#f5f5f5' : '#fff',
    letterSpacing: 0.5,
  },
});