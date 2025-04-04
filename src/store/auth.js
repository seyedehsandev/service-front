import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore(
  'auth',
  () => {
    const isLoggedIn = ref(false);
    const authUser = ref(null);
    const authError = ref(null);
    const users = ref([
      { id: 1, username: 'ehsan@gmail.com', password: '0147AAaa#' },
    ]);

    const findUser = (username, password) =>
      users.value.find(
        (user) => user.username === username && user.password === password
      );

    const login = (username, password) => {
      const user = findUser(username, password);
      if (user) {
        isLoggedIn.value = true;

        authUser.value = { id: user.id, username: user.username };
        authError.value = null;
        console.log('Login successful:', authUser.value);
        return true;
      } else {
        isLoggedIn.value = false;
        authUser.value = null;
        authError.value = 'نام کاربری یا رمز عبور نامعتبر است';
        console.error('Login failed:', authError.value);
        return false;
      }
    };

    const logout = () => {
      isLoggedIn.value = false;
      authUser.value = null;
      authError.value = null;
      console.log('User logged out');
    };

    return {
      isLoggedIn,
      authUser,
      authError,
      login,
      logout,
    };
  },
  {
    persist: {
      paths: ['isLoggedIn', 'authUser'],
    },
  }
);
