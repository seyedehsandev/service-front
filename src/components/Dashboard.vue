<template>
    <div dir="rtl" class="font-vazir">
      <div class="w-screen min-h-screen flex rounded-md bg-gray-50">
        <div class="w-full px-4 md:px-8">
          <header class="border-b border-gray-200">
            <h1 class="text-2xl md:text-3xl py-4 px-2 font-bold text-gray-800">داشبورد</h1>
          </header>
  
          <main class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-8">
            <router-link 
              to="/dashboard/drivers"
              class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800">راننده‌ها</h3>
                <i class="fas fa-user text-blue-500 text-2xl"></i>
              </div>
              <p class="text-sm text-gray-500 mt-2">مدیریت اطلاعات راننده‌ها</p>
            </router-link>
  
            <router-link 
              to="/dashboard/cars"
              class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800">خودروها</h3>
                <i class="fas fa-car text-blue-500 text-2xl"></i>
              </div>
              <p class="text-sm text-gray-500 mt-2">مدیریت اطلاعات خودروها</p>
            </router-link>
  
            <router-link 
              to="/dashboard/triplist"
              class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800">سفرها</h3>
                <i class="fas fa-route text-blue-500 text-2xl"></i>
              </div>
              <p class="text-sm text-gray-500 mt-2">مدیریت اطلاعات سفرها</p>
            </router-link>
  
            <router-link 
              to="/dashboard/repairhistory"
              class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800">تعمیرات</h3>
                <i class="fas fa-tools text-blue-500 text-2xl"></i>
              </div>
              <p class="text-sm text-gray-500 mt-2">مدیریت اطلاعات تعمیرات</p>
            </router-link>
  
            <router-link 
              to="/dashboard/reports"
              class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800">گزارشات</h3>
                <i class="fas fa-chart-line text-blue-500 text-2xl"></i>
              </div>
              <p class="text-sm text-gray-500 mt-2">مشاهده گزارشات سیستم</p>
            </router-link>
  
            <router-link 
              to="/dashboard/insurancecheck"
              class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800">بیمه</h3>
                <i class="fas fa-file-contract text-blue-500 text-2xl"></i>
              </div>
              <p class="text-sm text-gray-500 mt-2">مدیریت بیمه خودروها</p>
            </router-link>
  
            <!-- کارت سوخت -->
            <router-link 
              to="/dashboard/fuel"
              class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800">سوخت</h3>
                <i class="fas fa-gas-pump text-blue-500 text-2xl"></i>
              </div>
              <p class="text-sm text-gray-500 mt-2">مدیریت مصرف سوخت</p>
            </router-link>
  
            <!-- کارت لاگین -->
            <router-link 
              to="/auth/login"
              class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800">لاگین</h3>
                <i class="fas fa-sign-in-alt text-blue-500 text-2xl"></i>
              </div>
              <p class="text-sm text-gray-500 mt-2">ورود به سیستم</p>
            </router-link>
          </main>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  </script>
  
  <style scoped>
  </style>