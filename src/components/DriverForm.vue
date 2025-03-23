<template>
  <div dir="rtl" class="font-vazir">
      <div class="w-screen min-h-screen flex rounded-md bg-gray-50"> 
          <div class="w-full px-4 md:px-8"> 
            <!-- header  -->
              <header class="border-b border-gray-200">
                  <h1 class="text-2xl md:text-3xl py-4 px-2 font-bold text-gray-800">لیست راننده‌ها</h1>
              </header>
              <!-- main div  -->
              <main class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between px-2 py-6">
                  <div class="order-2 md:order-1">
                      <button 
                          @click="isFormOpen = true"
                          class="bg-gradient-to-r from-green-400 to-green-500 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-white font-medium flex items-center gap-2"
                      >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                          </svg>
                          افزودن راننده
                      </button>
                  </div>
                  
                  <div class="order-1 md:order-2 bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-100">
                      <span class="text-gray-600">تعداد کل راننده‌ها: 
                          <span class="font-bold text-blue-600">{{ driverCount }}</span>
                      </span>
                  </div>
              </main>

              <div class="rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-8 bg-white">
                  <table class="w-full">
                      <thead class="bg-gray-50 border-b border-gray-200">
                          <tr>
                              <th v-for="(header, index) in ['نام', 'نام خانوادگی', 'انقضا گواهینامه', 'شماره تلفن', 'کد پرسنلی', 'ویرایش', 'حذف']" 
                                  :key="index"
                                  class="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider"
                              >
                                  {{ header }}
                              </th>
                          </tr>
                      </thead>
                      
                      <tbody class="divide-y divide-gray-200">
                          <tr v-for="(item, index) in drivers" :key="index" 
                              class="hover:bg-gray-50 transition-colors duration-150">
                              <td class="px-4 py-3 text-sm text-gray-700">{{ item.name }}</td>
                              <td class="px-4 py-3 text-sm text-gray-700">{{ item.lastName }}</td>
                              <td class="px-4 py-3 text-sm text-gray-700">{{ item.licenceExpireTime }}</td>
                              <td class="px-4 py-3 text-sm text-blue-600 font-medium">{{ item.phone }}</td>
                              <td class="px-4 py-3 text-sm text-gray-700">{{ item.code }}</td>
                              
                              <td class="px-4 py-3">
                                  <button 
                                      @click="editData(item, index)"
                                      class="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 rounded-md text-white hover:shadow-md transition-all duration-200 text-sm"
                                  >
                                      ویرایش
                                  </button>
                              </td>
                              
                              <td class="px-4 py-3">
  <button 
    @click="DeleteItem(item, index)"
    class="bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 rounded-md text-white hover:shadow-md transition-all duration-200 text-sm flex items-center gap-1"
  >
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
    </svg>
    حذف
  </button>
</td>
                          </tr>
                      </tbody>
                  </table>
              </div>

              <form 
                  v-if="isFormOpen"
                  class="bg-white backdrop-blur-md flex flex-col p-8 gap-y-4 rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 shadow-xl border border-gray-100"
                  style="width: 95%; max-width: 640px;"
              >
              <button 
    @click="isFormOpen=false" 
    class="absolute top-4 left-4 bg-red-100 hover:bg-red-200 p-1.5 rounded-full transition-colors"
  >
    <svg class="w-6 h-6 text-red-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
    </svg>
  </button>

  <h2 class="font-bold text-2xl text-gray-800 mb-4">مشخصات خودرو</h2>

  <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">نام</label>
      <input 
        type="text" 
        v-model="driverData.name"
        class="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
        required
      >
    </div>
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">نام خانوداگی <span class="text-red-500">*</span></label>
      <input
        type="text"
        v-model="driverData.lastName"
        required
        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">انقضا گواهینامه <span class="text-red-500">*</span></label>
      <input
        type="date"
        v-model="driverData.licenceExpireTime"
        required
        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">شماره تلفن</label>
      <input
        type="text"
        v-model="driverData.phone"
        placeholder="09121122333"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
      >
    </div>



    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">کد پرسنلی</label>
      <input
        type="number"
        v-model="driverData.code"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
      >
    </div>

    
  </div>

  <button
    @click.prevent="submitting"
    class="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
  >
    تایید اطلاعات
  </button>              </form>
          </div>
      </div>
  </div>
</template>


<script setup>
import { reactive, ref, computed } from 'vue';
import { useStore } from '../store/useStore';
import { storeToRefs } from 'pinia';

const isFormOpen = ref(false);
const editingIndex = ref(null);
const store = useStore()
const { drivers } = storeToRefs(store);
const { deleteDriver } = store; 
const driverCount = computed(() => store.drivers.length);
const { addDriver } = useStore();

const driverData = reactive({
    name: '',
    lastName: '',
    licenceExpireTime: '',
    phone: '',
    code: '',

});

function resetForm() {
    Object.assign(driverData, {
    name: '',
    lastName: '',
    licenceExpiteTime: '',
    phone: '',
    code: '',

       
    });
    editingIndex.value = null; 
}

function submitting() {
    if (editingIndex.value !== null) {
        store.drivers[editingIndex.value] = { ...driverData, lastEdit: new Date() };
    } else {
        addDriver({ ...driverData, lastEdit: new Date() });
    }
    resetForm();
    isFormOpen.value = false;
}

function populateForm(data) {
    Object.assign(driverData, data);
}

function editData(data, index) {
    isFormOpen.value = true;
    editingIndex.value = index; 
    populateForm(data);
}

function DeleteItem(item, index) {
  if (confirm(`آیا از حذف ${item.name} ${item.lastName} مطمئن هستید؟`)) {
    deleteDriver(index); 
  }
}

</script>

<style scoped>

</style>