<script setup>
import MenuBar from './components/MenuBar.vue';
import { useAuthStore } from './store/auth.js';
import { computed } from 'vue';

const authStore = useAuthStore();

const isLogged = computed(() => authStore.isLoggedIn);
</script>
<template>
  <div>
    <MenuBar v-if="isLogged" />
    <router-view />
  </div>
</template>
