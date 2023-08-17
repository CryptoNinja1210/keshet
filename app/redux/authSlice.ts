import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../interfaces';
import { RootState } from '../redux';
import { userRepository } from '../repository';

interface AuthState {
  isLoggingIn: boolean;
  isLoggedIn: boolean;
  user: User | null;
  error: string | null;
}

const initialState: AuthState = {
  isLoggingIn: false,
  isLoggedIn: false,
  user: null,
  error: null,
}

export const loginUser = createAsyncThunk('auth/login', async (user: any) => {
  const userDoc = await userRepository.getUserDoc(user);
  return userDoc;
});

export const updateUser = createAsyncThunk('auth/subscription', async (user: User) => {
  console.log("in action update" + user);
  const updatedUser = await userRepository.updateUser(user);
  console.log("after db" + user);
  return updatedUser;
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.isLoggingIn = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoggingIn = false;
      state.isLoggedIn = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoggingIn = false;
      state.isLoggedIn = false;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
    },
    updateSubscription: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    }    
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoggingIn = false;
      state.isLoggedIn = true;
      state.user = action.payload;
      state.error = null;
    }),
    builder.addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoggingIn = false;
      state.isLoggedIn = true;
      state.user = action.payload;
      state.error = null;
    });
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout, updateSubscription } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthState = (state: RootState) => state.auth;
export const selectUserName = (state: RootState) => state.auth.user?.displayName;
export const selectUserEmail = (state: RootState) => state.auth.user?.email;
export const selectUserUid = (state: RootState) => state.auth.user?.uid;
export const selectSubscription = (state: RootState) => state.auth.user?.isSubscribed;
export const selectIsUserLoggedIn = (state: RootState) => state.auth.isLoggedIn;


export default authSlice.reducer;
