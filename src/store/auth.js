import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

const STRAPI_API_URL = import.meta.env.VITE_STRAPI_API_URL;

export const useAuthStore = defineStore(
  'auth',
  () => {
    const isLoggedIn = ref(false);
    const authUser = ref(null);
    const authToken = ref(null);
    const authError = ref(null);

    const setAuthData = (user, token) => {
      isLoggedIn.value = true;
      authUser.value = {
        id: user.id,
        username: user.username,
        email: user.email,
      };
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

    const login = async (identifier, password) => {
      authError.value = null;
      try {
        const response = await axios.post(`${STRAPI_API_URL}api/auth/local`, {
          identifier,
          password,
        });
        const { jwt, user } = response.data;
        setAuthData(user, jwt);
        console.log('Login successful (from store)');
        return true;
      } catch (error) {
        const message = error.response?.data?.error?.message || 'Login failed.';
        authError.value = message;
        clearAuthData();
        console.error('Login failed (from store):', message);
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
    persist: {
      paths: ['isLoggedIn', 'authUser', 'authToken'],
    },
  }
);
