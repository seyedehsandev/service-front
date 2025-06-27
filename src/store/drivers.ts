import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Driver } from '@/types';

export const useDriverStore = defineStore('drivers', () => {
  const drivers = ref<Driver[]>([]);

  const driverCount = computed(() => drivers.value.length);

  const getDriverById = computed(() => {
    return (driverId: number) =>
      drivers.value.find((driver) => driver.id === driverId);
  });

  const setDriversFromQuery = (driversData: Driver[]) => {
    drivers.value = driversData || [];
  };

  return {
    drivers,
    driverCount,
    getDriverById,
    setDriversFromQuery,
  };
});
