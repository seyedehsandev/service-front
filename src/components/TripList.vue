<template>
    <div dir="rtl">
        <div class="w-screen h-screen flex rounded-md ">
            <div class="w-full"> 
                <header>
                    <h1 class="text-2xl py-3 px-4">لیست سفر ها</h1>
                </header>
                <main class="flex gap-x-5 items-center px-2">
                    <div>
                        <button class="bg-green-300 px-3 py-2 hover:bg-green-500" @click="isFormOpen = true">ایجاد سفر جدید</button>
                    </div>
                    <div>
                        <span>کل سفر ها: {{ tripCount }}</span>
                    </div>
                </main>
                
                <table class="w-full border-collapse border border-gray-300 my-5">
                    <thead>
                        <tr class="bg-slate-300 text-gray-700">
                            <th class="p-3 border border-gray-300">راننده</th>
                            <th class="p-3 border border-gray-300">خودرو</th>
                            <th class="p-3 border border-gray-300">مبدا</th>
                            <th class="p-3 border border-gray-300">مقصد</th>
                            <th class="p-3 border border-gray-300">مسافت طی شده</th>
                            <th class="p-3 border border-gray-300">هزینه غذا</th>
                            <th class="p-3 border border-gray-300">سوخت مصرف شده</th>
                            <th class="p-3 border border-gray-300">سایر هزینه ها</th>
                            <th class="p-3 border border-gray-300">توضیحات</th>
                            <th class="p-3 border border-gray-300">ویرایش</th>
                            <th class="p-3 border border-gray-300">حذف</th>
                        </tr>
                    </thead>
                    <tbody class="pb-5">
                        <tr v-for="(item, index) in trips" :key="index" 
                            :class="index % 2 === 0 ? 'bg-slate-100' : 'bg-white'">
                            <td class="p-3 border border-gray-300 text-center">{{ item.driver }}</td>
                            <td class="p-3 border border-gray-300 text-center">{{ item.car }}</td>
                            <td class="p-3 border border-gray-300 text-center">{{ item.origin }}</td>
                            <td class="p-3 border border-gray-300 text-center">{{ item.destination }}</td>
                            <td class="p-3 border border-gray-300 text-center">{{ item.distance }} کیلومتر</td>
                            <td class="p-3 border border-gray-300 text-center">{{ item.mealPrice }} تومان</td>
                            <td class="p-3 border border-gray-300 text-center">{{ item.fuelConsum }} لیتر</td>
                            <td class="p-3 border border-gray-300 text-center">{{ item.otherCosts }} تومان</td>
                            <td class="p-3 border border-gray-300 text-center">{{ item.description }}</td>
                            <td class="p-3 border border-gray-300 text-center">
                                <button @click="editData(item, index)" class="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">
                                    ویرایش
                                </button>
                            </td>
                            <td class="p-3 border border-gray-300 text-center">
                                <button @click="DeleteItem(index)" class="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">
                                    حذف
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- فرم ویرایش/ایجاد -->
            <form 
                class="bg-white backdrop-blur-sm flex flex-col justify-center items-center p-8 gap-y-4 rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 shadow-2xl"
                style="width: 95%; max-width: 800px;"
                v-if="isFormOpen"
                @submit.prevent="submitting"
            >
                <button 
                    @click="isFormOpen = false" 
                    class="absolute top-4 left-4 bg-red-100 hover:bg-red-200 p-1.5 rounded-full transition-colors"
                >
                    <!-- آیکون بستن -->
                </button>

                <h2 class="font-bold text-2xl text-gray-800 mb-4">مشخصات کامل سفر</h2>

                <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- ستون اول -->
                    <div class="space-y-4">
                        <!-- راننده -->
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">راننده <span class="text-red-500">*</span></label>
                            <select
                                v-model="tripData.driver"
                                required
                                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            >
                                <option v-for="(item , index) in drivers" :key="index" :value="item.name">
                                    {{ item.name }} {{ item.lastName }}
                                </option>
                            </select>
                        </div>

                        <!-- خودرو -->
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">خودرو <span class="text-red-500">*</span></label>
                            <select
                                v-model="tripData.car"
                                required
                                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            >
                                <option v-for="(car , index) in cars" :key="index" :value="car.plate">
                                    {{ car.brand }} {{ car.model }} ({{ car.plate }})
                                </option>
                            </select>
                        </div>

                        <!-- مبدا و مقصد -->
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">مبدا <span class="text-red-500">*</span></label>
                            <input
                                type="text"
                                v-model="tripData.origin"
                                required
                                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            >
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">مقصد <span class="text-red-500">*</span></label>
                            <input
                                type="text"
                                v-model="tripData.destination"
                                required
                                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            >
                        </div>
                    </div>

                    <!-- ستون دوم -->
                    <div class="space-y-4">
                        <!-- مسافت و سوخت -->
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">مسافت (کیلومتر) <span class="text-red-500">*</span></label>
                            <input
                                type="number"
                                v-model="tripData.distance"
                                required
                                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            >
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">سوخت مصرفی (لیتر)</label>
                            <input
                                type="number"
                                v-model="tripData.fuelConsum"
                                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            >
                        </div>

                        <!-- هزینه‌ها -->
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">هزینه غذا (تومان)</label>
                            <input
                                type="number"
                                v-model="tripData.mealPrice"
                                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            >
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">سایر هزینه‌ها (تومان)</label>
                            <input
                                type="number"
                                v-model="tripData.otherCosts"
                                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            >
                        </div>

                        <!-- توضیحات -->
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">توضیحات</label>
                            <textarea
                                v-model="tripData.description"
                                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 h-24"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    class="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                    {{ editingIndex !== null ? 'بروزرسانی سفر' : 'ثبت سفر جدید' }}
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

const { trips, cars, drivers } = storeToRefs(useStore());
const store = useStore();

const tripCount = computed(() => trips.value.length);

const tripData = reactive({
    driver: '',
    car: '',
    origin: '',
    destination: '',
    distance: '',
    mealPrice: '',
    fuelConsum: '',
    otherCosts: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
});

function resetForm() {
    Object.assign(tripData, {
        driver: '',
        car: '',
        origin: '',
        destination: '',
        distance: '',
        mealPrice: '',
        fuelConsum: '',
        otherCosts: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    editingIndex.value = null;
}

function submitting() {
    const trip = {
        ...tripData,
        date: new Date(tripData.date).getTime(),
        lastEdit: Date.now()
    };

    if (editingIndex.value !== null) {
        store.updateTrip(editingIndex.value, trip);
    } else {
        store.addTrip(trip);
    }
    
    resetForm();
    isFormOpen.value = false;
}

function DeleteItem(index) {
    store.deleteTrip(index);
}
function populateForm(data) {
    Object.assign(tripData, data);
}

function editData(data, index) {
    isFormOpen.value = true;
    editingIndex.value = index; 
    populateForm(data);
}

</script>