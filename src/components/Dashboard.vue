<template>
    <div class="relative top-0 left-0">
        <button class="absolute top-4 left-4 rounded-lg hover:bg-slate-300 py-3 px-2 transition-all duration-300 ease-in-out" @click="toggle">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M3 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 5.25Zm0 4.5A.75.75 0 0 1 3.75 9h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 9.75Zm0 4.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Zm0 4.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
</svg>
</button>
        <div class="w-[300px] bg-slate-500 h-screen relative transition-all duration-1000 ease-in-out text-center pt-16 px-2" v-if="isOpen" >
            <button class="absolute top-2 right-2 rounded-lg hover:bg-slate-300 py-3 px-2 transition-all duration-300 ease-in-out" @click="toggle"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
</svg>
</button>
        <ul class="flex flex-col gap-y-3">
            <router-link to="/"><li class="font-bold px-3 py-2 bg-slate-400 hover:bg-slate-200 rounded-md transition-all duration-300 ease-in-out cursor-pointer">Home</li></router-link>
            <router-link to="/reports"><li class="font-bold px-3 py-2 bg-slate-400 hover:bg-slate-200 rounded-md transition-all duration-300 ease-in-out cursor-pointer">Reports</li></router-link>
            <router-link to="/cars"><li class="font-bold px-3 py-2 bg-slate-400 hover:bg-slate-200 rounded-md transition-all duration-300 ease-in-out cursor-pointer">Cars</li></router-link>
            <router-link to="/drivers"><li class="font-bold px-3 py-2 bg-slate-400 hover:bg-slate-200 rounded-md transition-all duration-300 ease-in-out cursor-pointer">Drivers</li></router-link>
            <router-link to="/travels"><li class="font-bold px-3 py-2 bg-slate-400 hover:bg-slate-200 rounded-md transition-all duration-300 ease-in-out cursor-pointer">Travels</li></router-link>
            <router-link to="/auth/login"><li class="font-bold px-3 py-2 bg-red-400 hover:bg-red-500 rounded-md transition-all duration-300 ease-in-out cursor-pointer">Logout</li></router-link>
        </ul>
    </div>
    <router-view>
        
    </router-view>
    </div>
    
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const goToReport = () => {
    router.push("/dashboard/report")
}
let isOpen = ref(false)

let toggle = () => {

    isOpen.value = !isOpen.value

}


   
</script>

<style scoped>

</style>