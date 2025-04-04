<template>
  <div
    class="w-full min-h-screen bg-[url('/1.webp')] bg-cover bg-center bg-no-repeat bg-blend-multiply bg-[rgba(164,255,205,0.416)]"
  >
    <div class="flex justify-center items-center h-screen">
      <form
        class="flex flex-col justify-center items-center bg-white/90 backdrop-blur-sm w-[350px] md:w-[450px] py-12 md:py-14 gap-y-6 rounded-xl shadow-2xl"
        @submit.prevent="handleLoginSubmit"
      >
        <span class="text-teal-800 font-bold text-3xl md:text-4xl pb-4"
          >Login</span
        >

        <div class="w-full px-6">
          <label for="username" class="sr-only">Username</label>
          <input
            id="username"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 disabled:opacity-70 disabled:bg-gray-100"
            v-model="user.username"
            type="email"
            placeholder="Username"
            autofocus
            :disabled="loginMutation.isPending.value"
          />
        </div>

        <div class="w-full px-6">
          <label for="password" class="sr-only">Password</label>
          <input
            id="password"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 disabled:opacity-70 disabled:bg-gray-100"
            v-model="user.password"
            type="password"
            placeholder="Password"
            :disabled="loginMutation.isPending.value"
          />
        </div>

        <button
          type="submit"
          class="w-[200px] px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loginMutation.isPending.value"
        >
          <span v-if="!loginMutation.isPending.value">Login</span>
          <span v-else>Loading...</span>
        </button>

        <div class="flex items-center justify-center gap-x-2">
          <input
            id="rememberMe"
            type="checkbox"
            class="accent-teal-600"
            v-model="user.remembered"
            :disabled="loginMutation.isPending.value"
          />
          <label for="rememberMe" class="text-teal-700 font-medium">
            Remember Me
          </label>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth.js';
import useVuelidate from '@vuelidate/core';
import { minLength, required, email } from '@vuelidate/validators';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { useMutation } from '@tanstack/vue-query';

const authStore = useAuthStore();
const router = useRouter();
const notyf = new Notyf({
  duration: 3000,
  position: { x: 'right', y: 'top' },
});

const user = reactive({
  username: '',
  password: '',
  remembered: false, // Added back for template v-model
});

const rules = {
  username: { required, email },
  password: {
    required,
    minLength: minLength(6),
    // hasCapitalLetter: (value) => /[A-Z]/.test(value || ''),
    // hasSpecialCharacter: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value || ''),
  },
};
const v$ = useVuelidate(rules, user);

const loginMutation = useMutation({
  mutationFn: (credentials) =>
    authStore.login(credentials.username, credentials.password),
  onSuccess: () => {
    notyf.success('You have been successfully logged in!');
    router.push('/dashboard');
  },
  onError: (error) => {
    console.error('Login mutation failed:', error);
    notyf.error(error.message || 'Login failed. Please try again later.');
  },
});

console.log('--- Debugging loginMutation ---'); // Debug log
console.log('loginMutation object:', loginMutation); // Debug log
console.log('loginMutation.isLoading:', loginMutation?.isLoading); // Debug log
try {
  // Debug log
  console.log(
    'loginMutation.isLoading.value:',
    loginMutation?.isLoading?.value
  ); // Debug log
} catch (e) {
  // Debug log
  console.error('Error accessing loginMutation.isLoading.value:', e); // Debug log
} // Debug log
console.log('--- End Debugging ---'); // Debug log

async function handleLoginSubmit() {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) {
    notyf.error('Please fix validation errors');
    const firstError = v$.value.$errors[0];
    if (firstError) {
      notyf.error(`Error in ${firstError.$property}: ${firstError.$message}`);
    }
    return;
  }
  loginMutation.mutate(user);
}
</script>
