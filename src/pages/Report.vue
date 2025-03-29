<template>
  <div dir="rtl" class="font-vazir">
    <div class="w-screen min-h-screen flex rounded-md bg-gray-50">
      <div class="w-full px-4 md:px-8">
        <header class="border-b border-gray-200">
          <h1 class="text-2xl md:text-3xl py-4 px-2 font-bold text-gray-800">گزارشات</h1>
        </header>

        <main class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
          <div 
            class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
            @click="navigateToReport('report1')"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-800">گزارش راننده‌ها</h3>
              <i class="fas fa-user text-blue-500 text-2xl"></i>
            </div>
            <p class="text-sm text-gray-500 mt-2">لیست کامل راننده‌ها و فعالیت‌های آنها</p>
          </div>

          <div 
            class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
            @click="navigateToReport('report2')"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-800">گزارش خودروها</h3>
              <i class="fas fa-car text-blue-500 text-2xl"></i>
            </div>
            <p class="text-sm text-gray-500 mt-2">اطلاعات کامل خودروها و وضعیت آنها</p>
          </div>

          <div 
            class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
            @click="navigateToReport('report3')"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-800">گزارش سفرها</h3>
              <i class="fas fa-route text-blue-500 text-2xl"></i>
            </div>
            <p class="text-sm text-gray-500 mt-2">جزئیات سفرها و هزینه‌های مرتبط</p>
          </div>

          <div 
            class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
            @click="navigateToReport('report4')"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-800">گزارش مالی</h3>
              <i class="fas fa-money-bill text-blue-500 text-2xl"></i>
            </div>
            <p class="text-sm text-gray-500 mt-2">خلاصه درآمدها و هزینه‌های سیستم</p>
          </div>

          <div 
            class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
            @click="navigateToReport('report5')"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-800">گزارش تعمیرات</h3>
              <i class="fas fa-tools text-blue-500 text-2xl"></i>
            </div>
            <p class="text-sm text-gray-500 mt-2">تاریخچه تعمیرات و هزینه‌های مرتبط</p>
          </div>

          <div 
            class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
            @click="navigateToReport('report6')"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-800">گزارش سوخت</h3>
              <i class="fas fa-gas-pump text-blue-500 text-2xl"></i>
            </div>
            <p class="text-sm text-gray-500 mt-2">مصرف سوخت و هزینه‌های مرتبط</p>
          </div>

          <div 
            class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
            @click="navigateToReport('report7')"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-800">گزارش بیمه</h3>
              <i class="fas fa-file-contract text-blue-500 text-2xl"></i>
            </div>
            <p class="text-sm text-gray-500 mt-2">وضعیت بیمه خودروها</p>
          </div>

          <div 
            class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
            @click="navigateToReport('report8')"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-800">گزارش عملکرد</h3>
              <i class="fas fa-chart-line text-blue-500 text-2xl"></i>
            </div>
            <p class="text-sm text-gray-500 mt-2">تحلیل عملکرد کلی سیستم</p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function navigateToReport(reportId) {
  router.push(`/reports/${reportId}`);
}
</script>

<style scoped>
</style>