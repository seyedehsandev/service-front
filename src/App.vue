<script setup>
import MenuBar from './components/MenuBar.vue';
import {useStore} from './store/useStore';
import {computed} from "vue"
const store = useStore();
const isLoged = computed(() => store.isLogedIn)



</script>

<template>

  <div>
   <MenuBar v-if="isLoged" />
    <router-view/>
  </div>
</template>

<style scoped>

</style>




