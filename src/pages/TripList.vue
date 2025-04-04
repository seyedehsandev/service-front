<template>
  <div dir="rtl" class="font-vazir">
    <div class="w-screen min-h-screen flex rounded-md bg-gray-50">
      <div class="w-full px-4 md:px-8">
        <!-- هدر -->
        <header class="border-b border-gray-200">
          <h1 class="text-2xl md:text-3xl py-4 px-2 font-bold text-gray-800">
            لیست سفرها
          </h1>
        </header>

        <!-- فیلترها و آمار -->
        <main
          class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between px-2 py-6"
        >
          <div class="order-2 md:order-1 flex gap-4">
            <button
              @click="isFormOpen = true"
              class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white font-medium flex items-center gap-2"
            >
              ایجاد سفر جدید
            </button>

            <div class="relative">
              <select
                v-model="selectedCarFilter"
                class="pl-4 pr-10 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer appearance-none"
              >
                <option value="">همه خودروها</option>
                <option v-for="car in cars" :key="car.plate" :value="car.plate">
                  {{ car.brand }} {{ car.model }} ({{ car.plate }})
                </option>
              </select>
              <div
                class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              >
                <svg
                  class="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            class="order-1 md:order-2 bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-100"
          >
            <span class="text-gray-600">
              تعداد سفرها:
              <span class="font-bold text-blue-600">{{
                filteredTrips.length
              }}</span>
            </span>
          </div>
        </main>

        <!-- جدول سفرها -->
        <div
          class="rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-8 bg-white"
        >
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  class="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                  تاریخ
                </th>
                <th
                  v-for="(header, index) in headers"
                  :key="index"
                  class="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="(item, index) in filteredTrips"
                :key="index"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ convertToJalali(item.date) }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.driver }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ item.car }}</td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.origin }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.destination }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.distance }} کیلومتر
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.fuel.type }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.fuel.consumption }} لیتر
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.fuel.cost }} تومان
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.mealPrice }} تومان
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.parkingCost }} تومان
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.tollCost }} تومان
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.fineCost }} تومان
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.otherCosts }} تومان
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.description }}
                </td>

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
                    حذف
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- فرم ایجاد/ویرایش سفر -->
        <form
          v-if="isFormOpen"
          class="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden backdrop-blur-lg"
        >
          <div
            class="border-b border-gray-200 p-4 flex items-center justify-between bg-white shadow-sm"
          >
            <h2 class="text-xl font-bold text-gray-800">مشخصات سفر</h2>
            <button
              @click="isFormOpen = false"
              class="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
            >
              ✕
            </button>
          </div>

          <div class="flex-1 overflow-auto p-6">
            <div
              class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <!-- بخش تاریخ شمسی -->
              <div class="space-y-4">
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700"
                    >تاریخ سفر</label
                  >
                  <DatePicker v-model="tripData.date"></DatePicker>
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700"
                    >راننده</label
                  >
                  <div class="relative">
                    <select
                      v-model="tripData.driver"
                      @change="setAssignedCar"
                      class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none pr-10"
                    >
                      <option value="">انتخاب راننده</option>
                      <option
                        v-for="driver in drivers"
                        :key="driver.id"
                        :value="driver.id"
                      >
                        {{ driver.name }} {{ driver.lastName }}
                      </option>
                    </select>
                    <div
                      class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    >
                      <svg
                        class="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700">مبدا</label>
                  <input
                    type="text"
                    v-model="tripData.origin"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700">مقصد</label>
                  <input
                    type="text"
                    v-model="tripData.destination"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
              </div>

              <!-- بخش هزینه‌ها -->
              <div class="space-y-4">
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700"
                    >مسافت (کیلومتر)</label
                  >
                  <input
                    type="number"
                    v-model="tripData.distance"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700"
                    >نوع سوخت</label
                  >
                  <div class="relative">
                    <select
                      v-model="tripData.fuel.type"
                      class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none pr-10"
                    >
                      <option value="بنزین">بنزین</option>
                      <option value="دیزل">دیزل</option>
                    </select>
                    <div
                      class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    >
                      <svg
                        class="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700"
                    >سوخت مصرفی (لیتر)</label
                  >
                  <input
                    type="number"
                    v-model="tripData.fuel.consumption"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700"
                    >هزینه سوخت (تومان)</label
                  >
                  <input
                    type="number"
                    v-model="tripData.fuel.cost"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700"
                    >هزینه غذا (تومان)</label
                  >
                  <input
                    type="number"
                    v-model="tripData.mealPrice"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700"
                    >هزینه پارکینگ (تومان)</label
                  >
                  <input
                    type="number"
                    v-model="tripData.parkingCost"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700"
                    >هزینه عوارض (تومان)</label
                  >
                  <input
                    type="number"
                    v-model="tripData.tollCost"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700"
                    >هزینه جریمه (تومان)</label
                  >
                  <input
                    type="number"
                    v-model="tripData.fineCost"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
              </div>

              <div class="md:col-span-2 lg:col-span-3">
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700"
                    >سایر هزینه‌ها (تومان)</label
                  >
                  <input
                    type="number"
                    v-model="tripData.otherCosts"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700"
                    >توضیحات</label
                  >
                  <textarea
                    v-model="tripData.description"
                    class="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all h-32"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- دکمه ثبت -->
          <div class="border-t border-gray-200 p-4 bg-gray-50">
            <button
              @click.prevent="submitting"
              class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              {{ editingIndex !== null ? 'بروزرسانی سفر' : 'ثبت سفر جدید' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, computed } from 'vue';
import { useStore } from '../store/useStore';
import { useCarStore } from './../store/cars.js';

import { storeToRefs } from 'pinia';
import { toJalaali, jalaaliToDateObject } from 'jalaali-js';
import DatePicker from 'vue3-persian-datetime-picker';

const headers = [
  'راننده',
  'خودرو',
  'مبدا',
  'مقصد',
  'مسافت',
  'نوع سوخت',
  'سوخت مصرفی',
  'هزینه سوخت',
  'هزینه غذا',
  'هزینه پارکینگ',
  'هزینه عوارض',
  'هزینه جریمه',
  'سایر هزینه‌ها',
  'توضیحات',
  'ویرایش',
  'حذف',
];

const { trips, drivers } = storeToRefs(useStore());
const store = useStore();
const { cars } = useCarStore();
const isFormOpen = ref(false);
const editingIndex = ref(null);
const selectedCarFilter = ref('');

const tripData = reactive({
  driver: '',
  car: '',
  origin: '',
  destination: '',
  distance: '',
  fuel: {
    type: 'بنزین',
    consumption: 0,
    cost: 0,
  },
  mealPrice: 0,
  parkingCost: 0,
  tollCost: 0,
  fineCost: 0,
  otherCosts: 0,
  description: '',
  date: '',
});

// محاسبه روزهای ماه
const daysInMonth = computed(() => {
  const days = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  return days[tripData.date.month - 1] || 30;
});

// فیلتر سفرها
const filteredTrips = computed(() => {
  return selectedCarFilter.value
    ? trips.value.filter((trip) => trip.car === selectedCarFilter.value)
    : trips.value;
});

// پیدا کردن خودروی مرتبط
const selectedCar = computed(() => {
  return cars.value.find((car) => car.driverId === tripData.driver);
});

// تنظیم خودروی مرتبط
const setAssignedCar = () => {
  tripData.car = selectedCar.value?.plate || '';
};

// ریست فرم
const resetForm = () => {
  Object.assign(tripData, {
    driver: '',
    car: '',
    origin: '',
    destination: '',
    distance: '',
    fuel: {
      type: 'بنزین',
      consumption: 0,
      cost: 0,
    },
    mealPrice: 0,
    parkingCost: 0,
    tollCost: 0,
    fineCost: 0,
    otherCosts: 0,
    description: '',
    date: {
      year: currentJalali.year,
      month: currentJalali.month,
      day: currentJalali.day,
    },
  });
  editingIndex.value = null;
};

// ثبت/آپدیت سفر
const submitting = () => {
  if (
    !validateJalaliDate(
      tripData.date.year,
      tripData.date.month,
      tripData.date.day
    )
  ) {
    alert('تاریخ وارد شده معتبر نیست');
    return;
  }

  try {
    const driver = drivers.value.find((d) => d.id === tripData.driver);

    const trip = {
      ...tripData,
      driver: driver ? `${driver.name} ${driver.lastName}` : 'نامشخص',
      date: gregorianDate,
      lastEdit: Date.now(),
    };

    if (editingIndex.value !== null) {
      store.updateTrip(editingIndex.value, trip);
    } else {
      store.addTrip(trip);
    }

    resetForm();
    isFormOpen.value = false;
  } catch (error) {
    console.error('خطا در تبدیل تاریخ:', error);
    alert('خطا در ثبت اطلاعات تاریخ');
  }
};

const DeleteItem = (item, index) => {
  if (
    confirm(`آیا از حذف سفر ${item.origin} به ${item.destination} مطمئن هستید؟`)
  ) {
    store.deleteTrip(index);
  }
};

// پر کردن فرم برای ویرایش
const populateForm = (data) => {
  try {
    const date = new Date(data.date);
    const { jy, jm, jd } = toJalaali(date);

    const driver = drivers.value.find(
      (d) => `${d.name} ${d.lastName}` === data.driver
    );

    Object.assign(tripData, {
      ...data,
      driver: driver?.id || '',
      date: {
        year: jy,
        month: jm,
        day: jd,
      },
      fuel: data.fuel || {
        type: 'بنزین',
        consumption: 0,
        cost: 0,
      },
    });
  } catch (error) {
    console.error('خطا در بازیابی اطلاعات:', error);
    resetForm();
  }
};

// فعال سازی حالت ویرایش
const editData = (data, index) => {
  isFormOpen.value = true;
  editingIndex.value = index;
  populateForm(data);
};
</script>
