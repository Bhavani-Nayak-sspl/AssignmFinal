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
  AuthStackParamList,
  AppStackParamList,
} from '../types/navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/FontAwesome5';

// Create navigators
const Tab = createBottomTabNavigator<RootTabsParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

// Auth Stack Navigator (for authentication flow)
const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <AuthStack.Screen name="Landing" component={LandingScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

// Bottom Tabs Navigator
const MainTabsNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      // screenOptions={({ route }) => ({
      //   header(props) {
      //     this.headerShown : false
      //   },
      //   tabBarIcon: ({ focused, color, size }) => {
          // let iconName: keyof typeof Ionicons.getRawGlyphMap;

          // switch (route.name) {
          //   case 'Home':
          //     iconName = focused ? 'home' : 'home-outline';
          //     break;
          //   case 'Search':
          //     iconName = focused ? 'search' : 'search-outline';
          //     break;
          //   case 'Notifications':
          //     iconName = focused ? 'notifications' : 'notifications-outline';
          //     break;
          //   case 'Profile':
          //     iconName = focused ? 'person' : 'person-outline';
          //     break;
          //   case 'Settings':
          //     iconName = focused ? 'settings' : 'settings-outline';
          //     break;
          //   default:
          //     iconName = 'home-outline';
          // }

          // return <Ionicons name={iconName} size={size} color={color} />;
        // },
        // tabBarActiveTintColor: '#007AFF',
      //   tabBarInactiveTintColor: '#8E8E93',
      //   tabBarStyle: {
      //     backgroundColor: '#FFFFFF',
      //     borderTopWidth: 1,
      //     borderTopColor: '#E5E5EA',
      //     paddingBottom: 5,
      //     paddingTop: 5,
      //     height: 60,
      //   },
      //   tabBarLabelStyle: {
      //     fontSize: 12,
      //     fontWeight: '500',
      //   },
      //   headerShown: false,
      // })}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarLabel: 'Home',
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
  );
};

// Main App Navigator
const AppNavigator: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Simulate checking auth status (replace with your auth logic)
        // const token = await AsyncStorage.getItem('authToken');
        // setIsAuthenticated(!!token);

        // For demo purposes, show auth flow first
        setIsAuthenticated(false);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // You can add a loading screen here if needed
  if (isLoading) {
    return null; // or a loading component
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AppStack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        {isAuthenticated ? (
          <AppStack.Screen name="MainTabs" component={MainTabsNavigator} />
        ) : (
          <AppStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
