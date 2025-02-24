<template>
    <div class="w-full min-h-screen login-container">
      <div class="flex justify-center items-center h-screen">
        <form 
          class="flex flex-col justify-center items-center bg-white/90 backdrop-blur-sm w-[350px] md:w-[450px] py-12 md:py-14 gap-y-6 rounded-xl shadow-2xl"
        >
          <!-- عنوان -->
          <span class="text-teal-800 font-bold text-3xl md:text-4xl pb-4">Login</span>
  
          <!-- فیلد نام کاربری -->
          <div class="w-full px-6">
            <input 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              v-model="user.username" 
              type="email" 
              placeholder="Username"
            >
          </div>
  
          <!-- فیلد رمز عبور -->
          <div class="w-full px-6">
            <input 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              v-model="user.password" 
              type="password" 
              placeholder="Password"
            >
          </div>
  
          <!-- دکمه لاگین -->
          <button 
            class="w-[200px] px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            @click.prevent="login"
          >
            Login
          </button>
  
          <!-- چک‌باکس Remember Me -->
          <div class="flex items-center justify-center gap-x-2">
            <input 
              id="rememberMe" 
              type="checkbox" 
              class="accent-teal-600"
              v-model="user.remembered"
            >
            <label for="rememberMe" class="text-teal-700 font-medium">
              Remember Me
            </label>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { reactive, computed } from 'vue';
  import useVuelidate from '@vuelidate/core';
  import { minLength, required, email } from '@vuelidate/validators';
  import { Notyf } from 'notyf';
  import 'notyf/notyf.min.css';
  import { useStore } from '../store/useStore';
  
  const store = useStore();
  const findedUser = store.findUser;
  const isLoged = computed(() => store.isLogedIn);
  const router = useRouter();
  const notyf = new Notyf();
  
  const user = reactive({
    username: '',
    password: '',
    remembered: false
  });
  
  const rules = {
    username: { required, email },
    password: {
      required,
      minLength: minLength(6),
      hasCapitalLetter: (value) => /[A-Z]/.test(value),
      hasSpecialCharacter: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value)
    }
  };
  
  const v$ = useVuelidate(rules, user);
  
  function login() {
    if (user.password && user.username) {
      v$.value.$touch();
  
      if (!v$.value.$invalid) {
        const isAuth = findedUser(user.username, user.password);
  
        v$.value.$reset();
        user.password = '';
        user.username = '';
  
        if (isAuth) {
          store.loginUser();
          isLoged.value && router.push("/dashboard");
          notyf.success('You have been successfully logged in!');
        } else {
          notyf.error('Incorrect username or password');
        }
      } else {
        notyf.error('Please fix validation errors');
      }
    } else {
      notyf.error('Please fill out the form');
    }
  }
  </script>
  
  <style scoped>
  .login-container {
    background-image: url('/1.webp');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-blend-mode: multiply;
    background-color: rgba(164, 255, 205, 0.416);
  }
  </style>