import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Car } from '@/types';

export const useCarStore = defineStore('cars', () => {
  const cars = ref<Car[]>([]);

  const carCount = computed(() => cars.value.length);

  const getCarById = computed(() => {
    return (carId: number) => cars.value.find((car) => car.id === carId);
  });

  const setCarsFromQuery = (carsData: Car[]) => {
    cars.value = carsData || [];
  };

  return {
    cars,
    carCount,
    getCarById,
    setCarsFromQuery,
  };
});
