<template>
    <div class="bg-pink-400">
dashboard
    </div>
    <button @click="changing">Go home</button>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()

function changing() {
    router.push("/")
    
}

   
</script>

<style scoped>

</style>