<template>
    <div class="w-full h-screen login-container">
        <div class="flex justify-center items-center md:justify-start md:items-stretch h-screen">
            <form class="flex flex-col justify-center items-center bg-rose-100/80 w-[350px] md:w-[450px] py-12  md:py-14 gap-y-4 rounded-lg md:rounded-none shadow-2xl">
                <span class="text-teal-800 font-semibold text-2xl md:text-4xl pb-6">Login</span>
            <input class="auth-input" v-model="user.username" type="email" placeholder="Username">
            <input class="auth-input" v-model="user.password" type="password" placeholder="Password">
            <button class="h-[40px] w-[193px] bg-white hover:bg-teal-800 hover:text-teal-100 text-teal-800 font-bold rounded-md transition-all duration-300 ease-in-out shadow-xl" @click.prevent="login">Login</button>
            <div class="flex items-center justify-center gap-x-2">
                <input 
  id="rememberMe" 
  type="checkbox" 
  class="accent-teal-500" 
  v-model="user.remembered"
>
<label for="rememberMe" class="text-teal-800 font-semibold">
  Remember
</label>

            </div>
           
        </form>
        </div>
    </div>
    
</template>

<script setup>
import { useRouter } from 'vue-router';
import {reactive  , ref} from 'vue'
import useVuelidate from '@vuelidate/core'
import { minLength , required , email } from '@vuelidate/validators'
const hasSpecialCharacter = (value) => ({
  $valid: /[!@#$%^&*(),.?":{}|<>]/.test(value),
  $message: 'Must contain at least one special character'
});

const hasCapitalLetter = (value) => ({
  $valid: /[A-Z]/.test(value),
  $message: 'Must contain at least one capital letter'
});

import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 


const router = useRouter()
const notyf = new Notyf();

    const  user = reactive({

        username: '',
        password: '',     
        remembered:false  
        
    })

    const rules = {
        username :{required , email } ,
        password : {
            required ,
            minLength : minLength(6),
            hasCapitalLetter,
            hasSpecialCharacter
        }
    }
    const v$ = useVuelidate(rules, user);

    function login(){
        if (user.password && user.username){
            v$.value.$touch()

            if(!v$.value.$invalid){

                console.log(user)

                v$.value.$reset()
                user.password=''
                user.username=''
                notyf.success('You have been successfully Loged in!');
                router.push("/dashboard")
                

            }else{

                console.log(user)
                notyf.error('Please fix validation errors'); 
                console.log('Validation Errors:', v$.value.$errors);


            }
           

        }else{
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