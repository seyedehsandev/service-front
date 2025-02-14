<template>
    <div dir="rtl">
        <div class="w-screen h-screen flex rounded-md ">
            <div class="w-full"> 
                <header>
                    <h1 class="text-2xl py-3 px-4">لیست خودرو ها</h1>
                </header>
                <main class="flex gap-x-5 items-center px-2">
                    <div>
                        <button class="bg-green-300 px-3 py-2 hover:bg-green-500" @click="isFormOpen = true">اضافه کردن خودرو</button>
                    </div>
                    <!-- head  -->
                     <div>
                        <div>
                            <span>کل خودرو ها: {{ carCount }}</span>
                        </div>
                     </div>
                </main>
                <table class="w-full border-collapse border border-gray-300 my-5">
    <thead>
        <tr class="bg-slate-300 text-gray-700">
            <th class="p-3 border border-gray-300">راننده</th>
            <th class="p-3 border border-gray-300">مدل</th>
            <th class="p-3 border border-gray-300">انقضا بیمه</th>
            <th class="p-3 border border-gray-300">نوع خودرو</th>
            <th class="p-3 border border-gray-300">سال ساخت</th>
            <th class="p-3 border border-gray-300">ویرایش</th>
            <th class="p-3 border border-gray-300">حذف</th>

        </tr>
    </thead>
    <tbody class="pb-5">
        <tr v-for="(item, index) in cars" :key="index" 
            :class="index % 2 === 0 ? 'bg-slate-100' : 'bg-white'">
            <td class="p-3 border border-gray-300 text-center">{{ item.driver }}</td>
            <td class="p-3 border border-gray-300 text-center">{{ item.model }}</td>
            <td class="p-3 border border-gray-300 text-center">{{ item.expireInsurance }}</td>
            <td class="p-3 border border-gray-300 text-center">{{ item.type }}</td>
            <td class="p-3 border border-gray-300 text-center">{{ item.year }}</td>

            <td class="p-3 border border-gray-300 text-center">
                <button @click="editData(item , index)" class="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">
                    ویرایش
                </button>
            </td>
            <td class="p-3 border border-gray-300 text-center">
                <button @click="DeleteItem(item , index)" class="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">
                    حذف
                </button>
            </td>
        </tr>
    </tbody>
</table>

            </div>
            <form 
  class="bg-white backdrop-blur-sm flex flex-col justify-center items-center p-8 gap-y-4 rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 shadow-2xl"
  style="width: 95%; max-width: 600px;"
  v-if="isFormOpen"
>
  <button 
    @click="isFormOpen = false" 
    class="absolute top-4 left-4 bg-red-100 hover:bg-red-200 p-1.5 rounded-full transition-colors"
  >
    <svg class="w-6 h-6 text-red-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
    </svg>
  </button>

  <h2 class="font-bold text-2xl text-gray-800 mb-4">مشخصات خودرو</h2>

  <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
   

    <!-- مدل -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">مدل <span class="text-red-500">*</span></label>
      <input
        type="text"
        v-model="carData.model"
        required
        placeholder="مثال: ۱۴۰۲"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
    </div>

    <!-- برند -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">برند <span class="text-red-500">*</span></label>
      <input
        type="text"
        v-model="carData.brand"
        required
        placeholder="مثال: ایران خودرو"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
    </div>

    <!-- نوع خودرو -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">نوع خودرو</label>
      <select 
        v-model="carData.type"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
      >
        <option value="ون">ون</option>
        <option value="تریلی">تریلی</option>
        <option value="خاور">خاور</option>
        <option value="سواری">سواری</option>
      </select>
    </div>

    <!-- سال تولید -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">سال تولید</label>
      <input
        type="number"
        v-model="carData.year"
        min="1360"
        max="1404"
        placeholder="سال شمسی"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
      >
    </div>

    <!-- راننده -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">راننده</label>
      <select
        v-model="carData.driver"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
      >
      <option v-for="(item, index) in drivers" :key="index" :value="item.name">{{ item.name }} {{ item.lastName }}</option>
      </select>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">پلاک <span class="text-red-500">*</span></label>
      <input
        type="text"
        v-model="carData.plate"
        required
        placeholder="مثال: ۱۱ الف ۲۳۴"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
      >
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">وضعیت خودرو</label>
      <input
        type="text"
        v-model="carData.status"
        placeholder="وضعیت فعلی"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
      >
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">انقضاء بیمه</label>
      <input
        type="date"
        v-model="carData.expireInsurance"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
      >
    </div>
  </div>

  <button
    @click.prevent="submitting"
    class="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
  >
    تایید اطلاعات
  </button>
</form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useStore } from '../store/useStore';
import { storeToRefs } from 'pinia';

const isFormOpen = ref(true);
const editingIndex = ref(null); 

const { cars , drivers } = storeToRefs(useStore());
const store = useStore();
const carCount = computed(() => store.cars.length);
const { addCar } = useStore();

const carData = reactive({
    color: '',
    model: '',
    brand: '',
    type: '',
    year: '',
    driver: '',
    pallet: '',
    status: '',
    expireInsurance: ''
});

function resetForm() {
    Object.assign(carData, {
        color: '',
        model: '',
        brand: '',
        type: '',
        year: '',
        driver: '',
        pallet: '',
        status: '',
        expireInsurance: ''
    });
    editingIndex.value = null;
}

function submitting() {
    if (editingIndex.value !== null) {
        store.cars[editingIndex.value] = { ...carData, lastEdit: new Date() };
    } else {
        addCar({ ...carData, lastEdit: new Date() });
    }
    resetForm();
    isFormOpen.value = false;
}

function populateForm(data) {
    Object.assign(carData, data);
}

function editData(data, index) {
    isFormOpen.value = true;
    editingIndex.value = index;
    populateForm(data);
}

function DeleteItem(item , index) {
    if (index !== -1) {
        store.cars.splice(index, 1);
    }
}

</script>

<style scoped>

</style>
