<script setup>
import MenuBar from './pages/MenuBar.vue';
import { useStore } from './store/useStore';
import { computed } from 'vue';
const store = useStore();
const isLoged = computed(() => store.isLoggedIn);
</script>

<template>
  <div>
    <MenuBar v-if="isLoged" />
    <router-view />
  </div>
</template>

<style scoped></style>
