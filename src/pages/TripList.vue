<template>
  <div dir="rtl" class="font-vazir">
    <div class="w-screen min-h-screen flex rounded-md bg-gray-50">
      <div class="w-full px-4 md:px-8">
        <header class="border-b border-gray-200">
          <h1 class="text-2xl md:text-3xl py-4 px-2 font-bold text-gray-800">
            لیست سفرها
          </h1>
        </header>

        <main
          class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between px-2 py-6"
        >
          <div class="order-2 md:order-1 flex flex-wrap gap-4">
            <button
              @click="
                isFormOpen = true;
                resetForm();
              "
              class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white font-medium flex items-center gap-2"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              ایجاد سفر جدید
            </button>

            <div class="relative">
              <select
                v-model="selectedCarFilter"
                class="pl-4 pr-10 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer appearance-none"
              >
                <option :value="null">همه خودروها</option>
                <option v-for="car in cars" :key="car.id" :value="car.id">
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
                  ></path>
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
              <span
                v-if="selectedCarFilter !== null"
                class="text-xs text-gray-500"
              >
                (از {{ trips.length }} کل)</span
              >
            </span>
          </div>
        </main>

        <div
          class="rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-8 bg-white"
        >
          <div class="overflow-x-auto">
            <table class="w-full min-w-[1200px]">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    class="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    تاریخ
                  </th>
                  <th
                    v-for="header in headers"
                    :key="header"
                    class="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-if="filteredTrips.length === 0">
                  <td
                    :colspan="headers.length + 2"
                    class="text-center py-6 text-gray-500"
                  >
                    سفری یافت نشد (با فیلتر انتخاب شده یا کلا).
                  </td>
                </tr>
                <tr
                  v-for="item in filteredTrips"
                  :key="item.id"
                  class="hover:bg-gray-50 transition-colors duration-150 text-sm"
                >
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{ formatDate(item.date) }}
                  </td>
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{
                      drivers.find((d) => d.id === item.driverId)?.name ||
                      'راننده'
                    }}
                    {{
                      drivers.find((d) => d.id === item.driverId)?.lastName ||
                      `(ID: ${item.driverId})`
                    }}
                  </td>
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{
                      cars.find((c) => c.id === item.carId)?.plate ||
                      `(ID: ${item.carId})`
                    }}
                  </td>
                  <td class="px-4 py-3 text-gray-700">{{ item.origin }}</td>
                  <td class="px-4 py-3 text-gray-700">
                    {{ item.destination }}
                  </td>
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{ item.distance?.toLocaleString() ?? '0' }} km
                  </td>
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{ item.fuel?.type ?? '-' }}
                  </td>
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{ item.fuel?.consumption?.toLocaleString() ?? '0' }} L
                  </td>
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{ item.fuel?.cost?.toLocaleString() ?? '0' }} T
                  </td>
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{ item.mealPrice?.toLocaleString() ?? '0' }} T
                  </td>
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{ item.parkingCost?.toLocaleString() ?? '0' }} T
                  </td>
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{ item.tollCost?.toLocaleString() ?? '0' }} T
                  </td>
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{ item.fineCost?.toLocaleString() ?? '0' }} T
                  </td>
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{ item.otherCosts?.toLocaleString() ?? '0' }} T
                  </td>
                  <td
                    class="px-4 py-3 text-gray-500 max-w-[200px] truncate"
                    :title="item.description"
                  >
                    {{ item.description || '-' }}
                  </td>

                  <td class="px-4 py-3 text-center whitespace-nowrap">
                    <button
                      @click="editData(item)"
                      class="text-blue-500 hover:text-blue-700 p-1 mx-1 transition-colors"
                      title="ویرایش سفر"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        ></path>
                      </svg>
                    </button>
                    <button
                      @click="DeleteItem(item)"
                      class="text-red-500 hover:text-red-700 p-1 mx-1 transition-colors"
                      title="حذف سفر"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="isFormOpen"
            class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            @click="isFormOpen = false"
          ></div>
        </transition>
        <transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <form
            v-if="isFormOpen"
            class="fixed inset-0 z-50 flex flex-col overflow-hidden bg-gray-50 shadow-2xl md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-h-[90vh] md:rounded-2xl md:max-w-4xl w-full"
            @submit.prevent="submitting"
          >
            <div
              class="border-b border-gray-200 p-4 flex items-center justify-between bg-white shadow-sm flex-shrink-0 md:rounded-t-2xl"
            >
              <h2 class="text-xl font-bold text-gray-800">
                {{ editingTripId ? 'ویرایش سفر' : 'ایجاد سفر جدید' }}
              </h2>
              <button
                @click="
                  isFormOpen = false;
                  resetForm();
                "
                type="button"
                class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
                title="بستن فرم"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto p-6 md:p-8">
              <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5"
              >
                <div class="space-y-5">
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >تاریخ سفر <span class="text-red-500">*</span></label
                    >
                    <DatePicker
                      v-model="tripData.date"
                      format="YYYY-MM-DD"
                      display-format="jYYYY/jMM/jDD"
                      input-class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >راننده <span class="text-red-500">*</span></label
                    >
                    <div class="relative">
                      <select
                        v-model="tripData.driverId"
                        required
                        class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 appearance-none pr-10 bg-white"
                      >
                        <option :value="null" disabled>
                          -- انتخاب راننده --
                        </option>
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
                          class="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >خودرو <span class="text-red-500">*</span></label
                    >
                    <div class="relative">
                      <select
                        v-model="tripData.carId"
                        required
                        class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 appearance-none pr-10 bg-white"
                      >
                        <option :value="null" disabled>
                          -- انتخاب خودرو --
                        </option>
                        <option
                          v-for="car in cars"
                          :key="car.id"
                          :value="car.id"
                        >
                          {{ car.brand }} {{ car.model }} ({{ car.plate }})
                        </option>
                      </select>
                      <div
                        class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      >
                        <svg
                          class="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >مبدا <span class="text-red-500">*</span></label
                    >
                    <input
                      type="text"
                      v-model.trim="tripData.origin"
                      required
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >مقصد <span class="text-red-500">*</span></label
                    >
                    <input
                      type="text"
                      v-model.trim="tripData.destination"
                      required
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >مسافت (کیلومتر)</label
                    >
                    <input
                      type="number"
                      min="0"
                      v-model.number="tripData.distance"
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div
                  class="space-y-5 border-t md:border-t-0 md:border-r border-gray-200 md:pr-6 pt-5 md:pt-0"
                >
                  <h3 class="text-md font-semibold text-gray-600 mb-3">
                    اطلاعات سوخت
                  </h3>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >نوع سوخت</label
                    >
                    <div class="relative">
                      <select
                        v-model="tripData.fuel.type"
                        class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 appearance-none pr-10 bg-white"
                      >
                        <option value="بنزین">بنزین</option>
                        <option value="دیزل">دیزل</option>
                        <option value="گاز">گاز</option>
                      </select>
                      <div
                        class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      >
                        <svg
                          class="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >سوخت مصرفی (لیتر)</label
                    >
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      v-model.number="tripData.fuel.consumption"
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >هزینه سوخت (تومان)</label
                    >
                    <input
                      type="number"
                      min="0"
                      v-model.number="tripData.fuel.cost"
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <h3 class="text-md font-semibold text-gray-600 pt-3 mb-3">
                    سایر هزینه‌ها
                  </h3>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >هزینه غذا (تومان)</label
                    >
                    <input
                      type="number"
                      min="0"
                      v-model.number="tripData.mealPrice"
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >هزینه پارکینگ (تومان)</label
                    >
                    <input
                      type="number"
                      min="0"
                      v-model.number="tripData.parkingCost"
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div
                  class="space-y-5 border-t lg:border-t-0 lg:border-r border-gray-200 lg:pr-6 pt-5 lg:pt-0"
                >
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >هزینه عوارض (تومان)</label
                    >
                    <input
                      type="number"
                      min="0"
                      v-model.number="tripData.tollCost"
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >هزینه جریمه (تومان)</label
                    >
                    <input
                      type="number"
                      min="0"
                      v-model.number="tripData.fineCost"
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >سایر هزینه‌ها (تومان)</label
                    >
                    <input
                      type="number"
                      min="0"
                      v-model.number="tripData.otherCosts"
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >توضیحات</label
                    >
                    <textarea
                      v-model.trim="tripData.description"
                      rows="4"
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="border-t border-gray-200 p-4 bg-gray-100 mt-auto flex-shrink-0 md:rounded-b-2xl"
            >
              <div class="max-w-5xl mx-auto flex justify-end gap-4">
                <button
                  @click="
                    isFormOpen = false;
                    resetForm();
                  "
                  type="button"
                  class="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-8 rounded-lg transition-colors duration-200 shadow hover:shadow-md"
                >
                  {{ editingTripId ? 'بروزرسانی سفر' : 'ثبت سفر' }}
                </button>
              </div>
            </div>
          </form>
        </transition>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useTripStore } from './../store/trips.js';
import { useCarStore } from './../store/cars.js';
import { useDriverStore } from './../store/drivers.js';
import { storeToRefs } from 'pinia';
import DatePicker from 'vue3-persian-datetime-picker';

const tripStore = useTripStore();
const carStore = useCarStore();
const driverStore = useDriverStore();

const { trips, tripCount } = storeToRefs(tripStore);
const { cars } = storeToRefs(carStore);
const { drivers } = storeToRefs(driverStore);

const { addTrip, updateTripById, deleteTripById, fetchTrips } = tripStore;
const { fetchCars } = carStore;
const { fetchDrivers } = driverStore;

const isFormOpen = ref(false);
const editingTripId = ref(null);
const selectedCarFilter = ref(null);

const tripData = reactive({
  driverId: null,
  carId: null,
  origin: '',
  destination: '',
  distance: null,
  fuel: {
    type: 'بنزین',
    consumption: null,
    cost: null,
  },
  mealPrice: null,
  parkingCost: null,
  tollCost: null,
  fineCost: null,
  otherCosts: null,
  description: '',
  date: new Date().toISOString(),
});

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

const filteredTrips = computed(() => {
  if (selectedCarFilter.value === null || selectedCarFilter.value === '') {
    return trips.value;
  }
  return trips.value.filter((trip) => trip.carId === selectedCarFilter.value);
});

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch (e) {
    return dateString;
  }
};

const resetForm = () => {
  Object.assign(tripData, {
    driverId: null,
    carId: null,
    origin: '',
    destination: '',
    distance: null,
    fuel: { type: 'بنزین', consumption: null, cost: null },
    mealPrice: null,
    parkingCost: null,
    tollCost: null,
    fineCost: null,
    otherCosts: null,
    description: '',
    date: new Date().toISOString(),
  });
  editingTripId.value = null;
};

const submitting = () => {
  if (
    !tripData.date ||
    !tripData.driverId ||
    !tripData.carId ||
    !tripData.origin ||
    !tripData.destination
  ) {
    alert('لطفا تاریخ، راننده، خودرو، مبدا و مقصد را مشخص کنید.');
    return;
  }

  tripData.fuel.consumption = tripData.fuel.consumption || 0;
  tripData.fuel.cost = tripData.fuel.cost || 0;
  tripData.mealPrice = tripData.mealPrice || 0;
  tripData.parkingCost = tripData.parkingCost || 0;
  tripData.tollCost = tripData.tollCost || 0;
  tripData.fineCost = tripData.fineCost || 0;
  tripData.otherCosts = tripData.otherCosts || 0;
  tripData.distance = tripData.distance || 0;

  if (editingTripId.value !== null) {
    console.log('Updating trip with ID:', editingTripId.value);
    updateTripById({
      ...tripData,
      id: editingTripId.value,
      lastEdit: new Date().toISOString(),
    });
  } else {
    console.log('Adding new trip');
    addTrip({ ...tripData, lastEdit: new Date().toISOString() });
  }

  resetForm();
  isFormOpen.value = false;
};

const editData = (tripItem) => {
  console.log('Editing trip:', tripItem);
  editingTripId.value = tripItem.id;
  Object.assign(tripData, {
    ...tripItem,
    fuel: {
      ...(tripItem.fuel || { type: 'بنزین', consumption: null, cost: null }),
    },
  });
  isFormOpen.value = true;
};

const DeleteItem = (tripItem) => {
  if (
    confirm(
      `آیا از حذف سفر از ${tripItem.origin} به ${tripItem.destination} مطمئن هستید؟`
    )
  ) {
    console.log('Deleting trip with ID:', tripItem.id);
    deleteTripById(tripItem.id);
  }
};

onMounted(() => {
  console.log('Trip component mounted');
  if (trips.value.length === 0) {
    console.log('Fetching trips...');
    fetchTrips();
  }
  if (drivers.value.length === 0) {
    console.log('Fetching drivers...');
    fetchDrivers();
  }
  if (cars.value.length === 0) {
    console.log('Fetching cars...');
    fetchCars();
  }
  if (!tripData.date) {
    tripData.date = new Date().toISOString();
  }
});
</script>
