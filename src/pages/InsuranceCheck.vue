<template>
  <div
    dir="rtl"
    class="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg"
  >
    <h2 class="text-xl font-bold text-gray-800 mb-4">🚗 گزارش وضعیت بیمه‌ها</h2>

    <table
      v-if="expiringInsurances.length"
      class="w-full border-collapse border border-gray-200 shadow-sm"
    >
      <thead class="bg-gray-100">
        <tr class="text-left">
          <th class="p-3 border">برند</th>
          <th class="p-3 border">مدل</th>
          <th class="p-3 border">پلاک</th>
          <th class="p-3 border">تاریخ انقضا</th>
          <th class="p-3 border">وضعیت</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="car in expiringInsurances"
          :key="car.plate"
          class="hover:bg-gray-50"
        >
          <td class="p-3 border">{{ car.brand }}</td>
          <td class="p-3 border">{{ car.model }}</td>
          <td class="p-3 border">{{ car.plate }}</td>
          <td class="p-3 border">{{ car.expireInsurance }}</td>
          <td
            class="p-3 border font-bold"
            :class="
              isExpired(car.expireInsurance)
                ? 'text-red-500'
                : 'text-yellow-500'
            "
          >
            {{
              isExpired(car.expireInsurance)
                ? '🚨 منقضی شده'
                : '⚠️ در حال انقضا'
            }}
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else class="text-green-600 font-semibold">
      ✅ همه بیمه‌ها معتبر هستند.
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCarStore } from './../store/cars';
import { storeToRefs } from 'pinia';

const { cars } = storeToRefs(useCarStore());

const warningDays = 30;
const today = new Date();

const expiringInsurances = computed(() =>
  cars.value.filter((car) => {
    const insuranceDate = new Date(car.expireInsurance);
    const diffDays = Math.ceil((insuranceDate - today) / (1000 * 60 * 60 * 24));
    return diffDays < warningDays;
  })
);

const isExpired = (date) => new Date(date) < today;
</script>
