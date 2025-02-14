<template>
    <div dir="rtl">
        <div class="w-screen h-screen flex rounded-md ">
            <div class="w-full"> 
                <header>
                    <h1 class="text-2xl py-3 px-4">لیست سوابق تعمیرات </h1>
                </header>
                <main class="flex gap-x-5 items-center px-2">
                    <div>
                        <button class="bg-green-300 px-3 py-2 hover:bg-green-500" @click="isFormOpen = true">ایجاد سابقه جدید</button>
                    </div>
                    <!-- head  -->
                     <div>
                        <div>
                            <span>تعداد کل سوابق: {{ driverCount }}</span>
                        </div>
                     </div>
                </main>
                <table class="w-full border-collapse border border-gray-300 my-5">
    <thead>
        <tr class="bg-slate-300 text-gray-700">
            <th class="p-3 border border-gray-300">راننده</th>
            <th class="p-3 border border-gray-300">مدل خودرو</th>
            <th class="p-3 border border-gray-300">نوع خودرو</th>
            <th class="p-3 border border-gray-300">نوع تعمیرات</th>
            <th class="p-3 border border-gray-300">هزینه تعمیرات</th>
            <th class="p-3 border border-gray-300">ویرایش</th>
            <th class="p-3 border border-gray-300">حذف</th>

        </tr>
    </thead>
    <tbody class="pb-5">
        <tr v-for="(item, index) in reportHistories" :key="index" 
            :class="index % 2 === 0 ? 'bg-slate-100' : 'bg-white'">
            <td class="p-3 border border-gray-300 text-center">{{ item.driver }}</td>
            <td class="p-3 border border-gray-300 text-center">{{ item.model }}</td>
            <td class="p-3 border border-gray-300 text-center">{{ item.type }}</td>
            <td class="p-3 border border-gray-300 text-center">{{ item.repairType }}</td>
            <td class="p-3 border border-gray-300 text-center">{{ item.repairCost }}</td>

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
    <svg class="w-6 h-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
    </svg>
  </button>

  <h2 class="font-bold text-2xl text-gray-800 mb-4">افزودن سابقه تعمیرات</h2>

  <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">نام راننده</label>
      <input 
        type="text" 
        v-model="repairData.driver"
        class="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
        required
      >
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">مدل خودرو</label>
      <input
        type="text"
        v-model="repairData.model"
        required
        class="w-full px-4 py-2 rounded-lg border border-gray-300"
      >
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">نوع خودرو</label>
      <input
        type="text"
        v-model="repairData.type"
        required
        class="w-full px-4 py-2 rounded-lg border border-gray-300"
      >
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">نوع تعمیرات</label>
      <input
        type="text"
        v-model="repairData.repairType"
        required
        class="w-full px-4 py-2 rounded-lg border border-gray-300"
      >
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">هزینه تعمیرات</label>
      <input
        type="number"
        v-model="repairData.cost"
        required
        min="0"
        class="w-full px-4 py-2 rounded-lg border border-gray-300"
      >
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">تاریخ تعمیرات</label>
      <input
        type="date"
        v-model="repairData.date"
        required
        class="w-full px-4 py-2 rounded-lg border border-gray-300"
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

const isFormOpen = ref(false);
const editingIndex = ref(null); 

const { reportHistories } = storeToRefs(useStore());
const store = useStore();
const historyCount = computed(() => store.repeirHistories.length);
const { addRepairHistories } = useStore();

const repairData = reactive({
    driver: '',
    model: '',
    type: '',
    repairType: '',
    cost: 0 ,
    date: "",
    submitDate: Date.now(),

});

function resetForm() {
    Object.assign(repairData, {
    driver: '',
    model: '',
    type: '',
    repairType: '',
    cost: 0 ,

       
    });
    editingIndex.value = null; 
}

function submitting() {
    if (editingIndex.value !== null) {
        store.repairhistories[editingIndex.value] = { ...repairData, lastEdit: new Date() };
    } else {
        addDriver({ ...repairData, lastEdit: new Date() });
    }
    resetForm();
    isFormOpen.value = false;
}

function populateForm(data) {
    Object.assign(repairData, data);
}

function editData(data, index) {
    isFormOpen.value = true;
    editingIndex.value = index; 
    populateForm(data);
}

function DeleteItem(item , index) {
    if (index !== -1) {
        store.repairhistories.splice(index, 1);
    }
}

</script>

<style scoped>

</style>