<template>
    <div class="pt-20 flex flex-col justify-center items-center gap-y-4">
      <h2 v-if="title" class="text-lg font-bold">{{ title }}</h2>
      <div class="flex justify-center items-center bg-slate-300 p-10 gap-x-3">
        <select v-model="selectedDate.year" class="text-center w-20">
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
        <select v-model="selectedDate.month" class="text-center w-24">
          <option v-for="(month, index) in monthNames" :key="index" :value="index + 1">
            {{ month }}
          </option>
        </select>
        <select v-model="selectedDate.day" class="text-center w-20">
          <option v-for="day in availableDays" :key="day" :value="day">
            {{ day }}
          </option>
        </select>
      </div>
      <div class="flex gap-x-4">
        <button @click="calculateDifference">محاسبه فاصله با امروز</button>
        <button @click="logJulianDay">نمایش JDN</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, computed, watch } from 'vue';
  import { toJalaali, j2d, jalaaliMonthLength } from 'jalaali-js';
  import { useDateStore } from './../../store/dateStore.js';
  
  defineProps({
    title: { type: String, default: '' },
    minYear: { type: Number, default: 1380 },
    maxYear: { type: Number, default: 1410 },
    initialDate: {
      type: Object,
      default: () => ({ year: 1404, month: 1, day: 1 }),
    },
  });
  
  const monthNames = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
  ];
  
  const availableYears = computed(() => {
    const startYear = props.minYear;
    const endYear = props.maxYear;
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  });
  
  const selectedDate = reactive({ ...props.initialDate });
  
  const availableDays = computed(() => {
    const year = selectedDate.year;
    const month = selectedDate.month;
    const daysInMonth = jalaaliMonthLength(year, month);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  });
  
  watch(
    () => [selectedDate.month, selectedDate.year],
    () => {
      if (selectedDate.day > availableDays.value.length) {
        selectedDate.day = availableDays.value.length;
      }
    }
  );
  
  const dateStore = useDateStore();
  
  const logJulianDay = () => {
    const jdn = j2d(selectedDate.year, selectedDate.month, selectedDate.day);
    console.log(`شماره روز جولیان: ${jdn}`);
  };
  
  const calculateDifference = () => {
    const diff = dateStore.getDifferenceWithToday(
      selectedDate.year,
      selectedDate.month,
      selectedDate.day
    );
    console.log(`فاصله: ${diff} روز`);
    console.log(`تاریخ امروز (شمسی):`, toJalaali(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()));
  };
  </script>
  
  <style scoped>
  .text-center {
    text-align: center;
  }
  </style>