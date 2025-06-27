// navigation/AppNavigator.tsx
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import screens
import LandingScreen from '../screens/LandingScreen';
import HomePage from '../screens/HomePage';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import types
import {
  RootTabsParamList,
  // AuthStackParamList,
  // AppStackParamList,
} from '../types/navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import History from '../screens/History';

// Create navigators
const Tab = createBottomTabNavigator<RootTabsParamList>();
// const AuthStack = createNativeStackNavigator<AuthStackParamList>();
// const AppStack = createNativeStackNavigator<AppStackParamList>();

// Auth Stack Navigator (for authentication flow)
// const AuthNavigator: React.FC = () => {
//   return (
//     <AuthStack.Navigator
//       screenOptions={{
//         headerShown: false,
//         gestureEnabled: true,
//       }}
//     >
//       <AuthStack.Screen name="Landing" component={LandingScreen} />
//       <AuthStack.Screen name="Register" component={RegisterScreen} />
//     </AuthStack.Navigator>
//   );
// };

// Bottom Tabs Navigator
const AppNavigator: React.FC = () => {
  return (

    <NavigationContainer>
    <Tab.Navigator initialRouteName='Home'
  screenOptions={({ route }) => ({
    tabBarActiveTintColor: '#FF6611',
    tabBarInactiveTintColor: '#BBB',
    animation : 'shift',
    headerShown: false,
    tabBarIcon: ({ color, size }) => {
     const icons: Record<keyof RootTabsParamList, string> = {
        Home: 'home',
         History : 'money-check',
        Profile: 'user',
      };
      return (
        <Icon
          name={icons[route.name]}
          color={color}
          size={size}
        />
      );
      
      
    },
  })}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        
        options={{
          tabBarLabel: 'Home',
          
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarLabel: 'History',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
     
    </Tab.Navigator>
    </NavigationContainer>
  );
};

// Main App Navigator
// const AppNavigator: React.FC = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(true);
//   const [isLoading, setIsLoading] = useState(true);

//   // Check authentication status
//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         setIsAuthenticated(false);
//       } catch (error) {
//         console.error('Error checking auth status:', error);
//         setIsAuthenticated(false);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuthStatus();
//   }, []);

 
//   if (isLoading) {
//     return null;
//   }

//   return (
//     <NavigationContainer>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
//       <AppStack.Navigator
//         screenOptions={{
//           headerShown: false,
//           gestureEnabled: true,
//         }}
//       >
//         {isAuthenticated ? (
//           <AppStack.Screen name="MainTabs" component={MainTabsNavigator} />
//         ) : (
//           <AppStack.Screen name="Auth" component={AuthNavigator} />
//         )}
//       </AppStack.Navigator>
//     </NavigationContainer>
//   );
// };

export default AppNavigator;
