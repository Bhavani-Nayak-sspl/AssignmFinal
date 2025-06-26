// types/navigation.ts
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';

// Root Tab Navigator Params
export type RootTabsParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  Search: undefined;
  Notifications: undefined;
};

// Auth Stack Params (if you need authentication flow)
export type AuthStackParamList = {
  Landing: undefined;
  Register: undefined;
  Login: undefined;
  ForgotPassword: undefined;
};

// Main App Stack Params (if you have nested navigation)
export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabsParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Modal: undefined;
  Details: { id: string };
};

// Tab Screen Props Types
export type HomeScreenProps = BottomTabScreenProps<RootTabsParamList, 'Home'>;
export type ProfileScreenProps = BottomTabScreenProps<RootTabsParamList, 'Profile'>;
export type SettingsScreenProps = BottomTabScreenProps<RootTabsParamList, 'Settings'>;
export type SearchScreenProps = BottomTabScreenProps<RootTabsParamList, 'Search'>;
export type NotificationsScreenProps = BottomTabScreenProps<RootTabsParamList, 'Notifications'>;

// Declare global types for TypeScript navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList {}
  }
}