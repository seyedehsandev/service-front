<template>
    <div class="bg-yellow-200">
        Home
    </div>
    <button @click="goLogin">Login Page</button>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()

function goLogin () {
    router.push("/auth/login")
}
    
</script>

<style scoped>

</style>