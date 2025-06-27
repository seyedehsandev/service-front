import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import axios from 'axios';
import type { User } from '@/types';

const STRAPI_API_URL = import.meta.env.VITE_STRAPI_API_URL;

export const useAuthStore = defineStore(
  'auth',
  () => {
    const isLoggedIn = ref(false);
    const authUser: Ref<User | null> = ref(null);
    const authToken: Ref<string | null> = ref(null);
    const authError: Ref<string | null> = ref(null);

    const setAuthData = (user: User, token: string) => {
      isLoggedIn.value = true;
      authUser.value = user;
      authToken.value = token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      authError.value = null;
    };

    const clearAuthData = () => {
      isLoggedIn.value = false;
      authUser.value = null;
      authToken.value = null;
      delete axios.defaults.headers.common['Authorization'];
    };

    const login = async (identifier: string, password: string) => {
      authError.value = null;
      try {
        const response = await axios.post(`${STRAPI_API_URL}/api/auth/local`, {
          identifier,
          password,
        });
        const { jwt, user } = response.data;
        setAuthData(user, jwt);
        console.log('Login successful (from store)');
        return true;
      } catch (error: any) {
        const message = error.response?.data?.error?.message || 'Login failed.';
        authError.value = message;
        clearAuthData();
        console.error('Login failed (from store):', error);
        throw new Error(message);
      }
    };

    const logout = () => {
      clearAuthData();
      authError.value = null;
      console.log('User logged out');
    };

    const checkAuth = () => {
      if (authToken.value && authUser.value) {
        console.log('checkAuth: Token found, restoring auth state.');
        setAuthData(authUser.value, authToken.value);
      } else {
        console.log('checkAuth: No valid persisted auth state found.');
        clearAuthData();
      }
    };

    return {
      isLoggedIn,
      authUser,
      authToken,
      authError,
      login,
      logout,
      checkAuth,
    };
  },
  {
    persist: true,
  }
);
