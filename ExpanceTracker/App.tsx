/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { Platform, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import AppNavigator from './src/Navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/components/ThemeProvider';
import ToastManager from 'toastify-react-native/components/ToastManager';
import Icon  from 'react-native-vector-icons/MaterialIcons';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

// Custom toast component - simplified without progress bar
const CustomToast = ({ text1, text2, hide, iconColor } : any) => (
  <View style={styles.customToast}>
    <Icon name='star' size={24} color={iconColor || '#FFD700'} />
    <View style={styles.textContainer}>
      <Text style={styles.customTitle}>{text1}</Text>
      {text2 && <Text style={styles.customMessage}>{text2}</Text>}
    </View>
    <Icon name='close' size={20} color='#fff' onPress={hide} />
  </View>
)

// Custom toast configuration
const toastConfig = {
  customSuccess: (props : any) => (
    <View style={styles.customSuccessToast}>
      <Icon name='check-circle' size={24} color='#fff' />
      <View style={styles.textContainer}>
        <Text style={styles.customTitle}>{props.text1}</Text>
        {props.text2 && <Text style={styles.customMessage}>{props.text2}</Text>}
      </View>
    </View>
  ),
  custom: (props : any) => <CustomToast {...props} />,
}


function App() {
    const { theme, toggleTheme } = useTheme();
   const [isRTL, setIsRTL] = useState(false)
  const [showProgressBar, setShowProgressBar] = useState(true)
  const [showCloseIcon, setShowCloseIcon] = useState(true)
  return (
    <>
    <Provider store={store}>
      <ThemeProvider >
      <StatusBar hidden />
    <AppNavigator/>
      </ThemeProvider>
    <ToastManager
    config={toastConfig}
        theme={theme}
        position='bottom'
        isRTL={isRTL}
        showProgressBar={showProgressBar}
        showCloseIcon={showCloseIcon}
        animationStyle='fade'/>
      </Provider>
    </>
  );
}


export default App;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  settingsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  customSuccessToast: {
    width: '90%',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  customToast: {
    width: '90%',
    backgroundColor: '#673AB7',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  customTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  customMessage: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  customProgressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
  },
})
