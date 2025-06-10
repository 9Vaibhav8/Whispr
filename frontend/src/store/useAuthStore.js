import { create } from 'zustand';
import axios from '../api/axios'; // customize path if needed

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  // --- SIGNUP ---
  signup: async (formData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post('/api/auth/register', formData, {
        withCredentials: true, // ⬅️ include cookies
      });
      set({ user: res.data.user || null });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Signup failed' });
    } finally {
      set({ loading: false });
    }
  },

  // --- LOGIN ---
  login: async (formData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post('/api/auth/login', formData, {
        withCredentials: true, // ⬅️ send/receive cookie
      });
      set({ user: res.data.user || null });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed' });
    } finally {
      set({ loading: false });
    }
  },

  // --- LOGOUT ---
  logout: async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      set({ user: null });
    } catch (err) {
      console.error("Logout error:", err);
    }
  },

  // --- FETCH AUTH USER ---
  authUser: async () => {
    set({ loading: true });
    try {
      const res = await axios.get('/api/auth/check', {
        withCredentials: true, // ⬅️ include cookies
      });
      set({ user: res.data });
    } catch (err) {
      set({ user: null });
      console.error('authUser error:', err);
    } finally {
      set({ loading: false });
    }
  },

  // --- CHECK AUTH ON APP LOAD ---
  checkAuth: async () => {
    try {
      const res = await axios.get('/api/auth/check', {
        withCredentials: true,
      });
      set({ user: res.data });
    } catch (err) {
      set({ user: null });
    }
  }
}));

export default useAuthStore;
