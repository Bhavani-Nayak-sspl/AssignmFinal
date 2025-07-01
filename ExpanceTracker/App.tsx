/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { Platform, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import AppNavigator from './src/Navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/components/ThemeProvider';
import Icon  from 'react-native-vector-icons/MaterialIcons';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

function App() {
   return (
    <>
    <Provider store={store}>
      <ThemeProvider >
      <StatusBar hidden />
    <AppNavigator/>
      </ThemeProvider>
      </Provider>
    </>
   )
  
}


export default App;
