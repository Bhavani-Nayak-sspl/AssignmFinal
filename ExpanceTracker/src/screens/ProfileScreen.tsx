import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useTheme } from '../components/ThemeProvider';


const ProfileScreen = () => {
  const { theme, toggleTheme } = useTheme();

  const backgroundColor = theme === 'dark' ? '#000' : '#fff';
  const textColor = theme === 'dark' ? '#fff' : '#000';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={{ color: textColor }}>Current theme: {theme}</Text>
      <Button title="Toggle Theme" onPress={toggleTheme} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
