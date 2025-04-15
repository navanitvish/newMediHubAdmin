import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('newMedihubUser')) || null,
  token: localStorage.getItem('newMedihubToken') || null,
  isAuthenticated: !!localStorage.getItem('newMedihubToken'),
  loading: false,
  error: null,
  loginRedirect: localStorage.getItem('newMedihubLoginRedirect') !== 'false'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loginRedirect = false;
      localStorage.setItem('newMedihubToken', action.payload.token);
      localStorage.setItem('newMedihubUser', JSON.stringify(action.payload.user));
      localStorage.setItem('newMedihubLoginRedirect', 'false');
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loginRedirect = true;
      localStorage.removeItem('newMedihubToken');
      localStorage.removeItem('newMedihubUser');
      localStorage.setItem('newMedihubLoginRedirect', 'true');
    },
    updateProfile: (state, action) => {
      state.user = {...state.user, ...action.payload};
      localStorage.setItem('newMedihubUser', JSON.stringify(state.user));
    },
    restoreSession: (state) => {
      const token = localStorage.getItem('newMedihubToken');
      const user = localStorage.getItem('newMedihubUser');
      const loginRedirect = localStorage.getItem('newMedihubLoginRedirect');
      
      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
        state.loginRedirect = loginRedirect !== 'false';
      }
    },
    resetLoginRedirect: (state) => {
      state.loginRedirect = true;
      localStorage.setItem('newMedihubLoginRedirect', 'true');
    }
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  restoreSession,
  resetLoginRedirect
} = authSlice.actions;

export default authSlice.reducer;