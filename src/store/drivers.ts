// stores/drivers.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useDriverStore = defineStore('drivers', () => {
  const drivers = ref([]);

  const driverCount = computed(() => drivers.value.length);

  const getDriverById = computed(() => {
    return (driverId) => drivers.value.find((driver) => driver.id === driverId);
  });

  const setDriversFromQuery = (driversData) => {
    drivers.value = driversData || [];
  };

  return {
    drivers,
    driverCount,
    getDriverById,
    setDriversFromQuery,
  };
});
