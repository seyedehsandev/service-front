<template>
    <div class="bg-yellow-200 flex items-center justify-center h-screen w-screen">
        Home
        <button @click="goLogin">Login Page</button>

    </div>
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