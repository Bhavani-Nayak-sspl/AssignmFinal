import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../../types/navigation';

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
  try {
    await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
  } catch (error) {
    throw new Error('Failed to save transactions to AsyncStorage');
  }
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
      console.log(storedData, 'Stored Transactions');
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load transactions');
    }
  }
);

// Async thunk to update a transaction
export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async (transaction: Transaction, { rejectWithValue }) => {
    try {
      const existingTransactions = await AsyncStorage.getItem('transactions');
      const transactions: Transaction[] = existingTransactions
        ? JSON.parse(existingTransactions)
        : [];

      const updatedTransactions = transactions.map(t =>
        t.id === transaction.id ? { ...t, ...transaction } : t
      );

      await saveTransactions(updatedTransactions);
      console.log('Transaction updated:', transaction);
      return transaction;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update transaction'
      );
    }
  }
);

// Async thunk to delete a transaction
export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const existingTransactions = await AsyncStorage.getItem('transactions');
      const transactions: Transaction[] = existingTransactions
        ? JSON.parse(existingTransactions)
        : [];

      const updatedTransactions = transactions.filter(t => t.id !== transactionId);
      await saveTransactions(updatedTransactions);
      console.log('Transaction deleted:', transactionId);
      return transactionId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to delete transaction'
      );
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
      })
      // Update Transaction cases
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.transactions = state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        );
        state.loading = false;
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Transaction cases
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action: PayloadAction<string>) => {
        state.transactions = state.transactions.filter(t => t.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default transactionSlice.reducer;