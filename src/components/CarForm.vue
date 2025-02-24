<template>
  <div dir="rtl" class="font-vazir">
    <div class="w-screen min-h-screen flex rounded-md bg-gray-50">
      <div class="w-full px-4 md:px-8">
        <header class="border-b border-gray-200">
          <h1 class="text-2xl md:text-3xl py-4 px-2 font-bold text-gray-800">لیست خودروها</h1>
        </header>

        <main class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between px-2 py-6">
          <div class="order-2 md:order-1">
            <button 
              @click="isFormOpen = true"
              class="bg-gradient-to-r from-green-400 to-green-500 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-white font-medium flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              اضافه کردن خودرو
            </button>
          </div>

          <div class="order-1 md:order-2 bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-100">
            <span class="text-gray-600">
              تعداد کل خودروها: <span class="font-bold text-blue-600">{{ carCount }}</span>
            </span>
          </div>
        </main>

        <div class="rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-8 bg-white">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  v-for="(header, index) in ['راننده', 'مدل', 'انقضا بیمه', 'نوع خودرو', 'سال ساخت', 'ویرایش', 'حذف']" 
                  :key="index"
                  class="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr 
                v-for="(item, index) in cars" 
                :key="index" 
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-4 py-3 text-sm text-gray-700">{{ item.driver }}</td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ item.model }}</td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ item.expireInsurance }}</td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ item.type }}</td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ item.year }}</td>

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
            @click="isFormOpen = false" 
            class="absolute top-4 left-4 bg-red-100 hover:bg-red-200 p-1.5 rounded-full transition-colors"
          >
            <svg class="w-6 h-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
            </svg>
          </button>

          <h2 class="font-bold text-2xl text-gray-800 mb-4">مشخصات خودرو</h2>

          <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
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
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useStore } from '../store/useStore';
import { storeToRefs } from 'pinia';

const isFormOpen = ref(false);
const editingIndex = ref(null);

const { cars, drivers } = storeToRefs(useStore());
const store = useStore();
const carCount = computed(() => store.cars.length);
const { addCar } = useStore();

const carData = reactive({
  model: '',
  brand: '',
  type: '',
  year: '',
  driver: '',
  plate: '',
  status: '',
  expireInsurance: ''
});

function resetForm() {
  Object.assign(carData, {
    model: '',
    brand: '',
    type: '',
    year: '',
    driver: '',
    plate: '',
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

function DeleteItem(item, index) {
  if (confirm(`آیا از حذف ${item.model} ${item.brand} مطمئن هستید؟`)) {
    store.cars.splice(index, 1);
  }
}
</script>

<style scoped>
</style>