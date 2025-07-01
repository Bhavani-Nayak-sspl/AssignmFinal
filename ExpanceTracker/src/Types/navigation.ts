

export type RootTabsParamList = {
  Home: undefined;
  History : undefined;
  Profile: undefined;
};

// // Auth Stack Params (if you need authentication flow)
// export type AuthStackParamList = {
//   Landing: undefined;
//   Register: undefined;
//   Login: undefined;
//   ForgotPassword: undefined;
// };

// // Main App Stack Params (if you have nested navigation)
// export type AppStackParamList = {
//   MainTabs: NavigatorScreenParams<RootTabsParamList>;
//   Auth: NavigatorScreenParams<AuthStackParamList>;
//   Modal: undefined;
//   Details: { id: string };
// };

// // Tab Screen Props Types
// export type HomeScreenProps = BottomTabScreenProps<RootTabsParamList, 'Home'>;
// export type ProfileScreenProps = BottomTabScreenProps<RootTabsParamList, 'Profile'>;

// // Declare global types for TypeScript navigation
// declare global {
//   namespace ReactNavigation {
//     interface RootParamList extends AppStackParamList {}
//   }
// }

export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  category: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

