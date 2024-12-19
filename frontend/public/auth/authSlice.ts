import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
  role:string|null
}

const initialState: AuthState = {
  isAuthenticated: false,
  username: null,
  token: null,
  role:null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ username: string; token: string;role:string }>) => {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.role=action.payload.role;
    },
    clearCredentials: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      state.token = null;
    }
  }
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;