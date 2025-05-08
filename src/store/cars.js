import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCarStore = defineStore('cars', () => {
  const cars = ref([]);

  const carCount = computed(() => cars.value.length);

  const getCarById = computed(() => {
    return (carId) => cars.value.find((car) => car.id === carId);
  });

  const setCarsFromQuery = (carsData) => {
    cars.value = carsData || [];
  };

  return {
    cars,
    carCount,
    getCarById,
    setCarsFromQuery,
  };
});
