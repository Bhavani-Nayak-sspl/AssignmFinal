// transactionSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, } from '../../types/navigation';

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
};

// Helper function to save transactions to AsyncStorage
const saveTransactions = async (transactions: Transaction[]) => {
  await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
};

// Async thunk to add a transaction
export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async (transaction: Omit<Transaction, 'id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      const transactionWithMetadata: Transaction = {
        ...transaction,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      const existingTransactions = await AsyncStorage.getItem('transactions');
      const transactions: Transaction[] = existingTransactions
        ? JSON.parse(existingTransactions)
        : [];

      const updatedTransactions = [...transactions, transactionWithMetadata];
      await saveTransactions(updatedTransactions);



      console.log('Transaction submitted:', transactionWithMetadata);
      return transactionWithMetadata;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to add transaction'
      );
    }
  }
);
// Async thunk to load transactions
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const storedData = await AsyncStorage.getItem('transactions');
      if (storedData) {
        return JSON.parse(storedData) as Transaction[];
      }
      console.log(storedData,'Stored Transactions')
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load transactions');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // Synchronous reducers can be added here if needed
  },
  extraReducers: (builder) => {
    builder
      // Add Transaction cases
      .addCase(addTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.transactions.push(action.payload);
        state.loading = false;
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Load Transactions cases
     .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default transactionSlice.reducer;