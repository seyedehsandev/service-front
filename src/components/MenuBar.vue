<template>
  <div class="absolute top-0 left-0 z-50">
    <button
      class="absolute top-4 left-4 p-3 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 group"
      @click="toggle"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 text-slate-700 group-hover:text-indigo-600 transition-colors"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M3 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 5.25Zm0 4.5A.75.75 0 0 1 3.75 9h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 9.75Zm0 4.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Zm0 4.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <transition name="slide">
      <div
        v-if="isOpen"
        class="w-[280px] bg-white h-screen relative text-right pt-20 px-4 shadow-xl backdrop-blur-sm"
      >
        <button
          class="absolute top-4 right-4 p-2 rounded-full bg-white shadow-sm hover:shadow-md text-slate-500 hover:text-red-600 transition-all"
          @click="toggle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <div class="text-center py-4">
          <span
            class="px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer font-medium text-gray-500 hover:text-black"
            >{{ authStore.authUser.email.toUpperCase() }}</span
          >
        </div>
        <ul class="flex flex-col gap-2">
          <router-link
            v-for="(item, index) in menuItems"
            :key="index"
            :to="item.to"
            v-slot="{ isActive }"
          >
            <li
              :class="[
                'px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer font-medium',
                isActive
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600',
              ]"
            >
              {{ item.name }}
            </li>
          </router-link>

          <li
            @click="exitHandler"
            class="px-4 py-3 rounded-xl text-red-600 bg-red-100 hover:bg-red-200 transition-all duration-300 cursor-pointer font-medium mt-4 flex items-center gap-2 justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm5.03 4.72a.75.75 0 0 1 0 1.06l-1.72 1.72h10.94a.75.75 0 0 1 0 1.5H10.81l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0Z"
                clip-rule="evenodd"
              />
            </svg>
            خروج
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const isOpen = ref(false);

// const menuItems = [
//   { name: 'داشبورد', to: '/dashboard' },
//   { name: 'گزارشات', to: '/reports' },
//   { name: 'خودرو ها', to: '/cars' },
//   { name: 'راننده ها', to: '/drivers' },
//   { name: 'سفر ها', to: '/trip-list' },
//   { name: 'سابقه تعمیرات', to: '/repair-history' },
//   { name: 'بیمه', to: '/insurance-check' },
//   { name: 'هزینه‌ها', to: '/expenses' },
// ];
const menuItems = [
  { name: 'داشبورد', to: '/dashboard' },
  { name: 'خودرو ها', to: '/cars' },
  { name: 'رانندگان', to: '/drivers' },
  { name: 'سفر ها', to: '/trip-list' },
];

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const exitHandler = () => {
  authStore.logout();
  router.push('/auth/login');
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
