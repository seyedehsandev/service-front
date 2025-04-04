// stores/drivers.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useDriverStore = defineStore(
  'drivers',
  () => {
    const drivers = ref([]);

    const driverCount = computed(() => drivers.value.length);

    const getDriverById = computed(() => {
      return (driverId) =>
        drivers.value.find((driver) => driver.id === driverId);
    });

    const addDriver = (newDriver) => {
      const newId =
        drivers.value.length > 0
          ? Math.max(...drivers.value.map((d) => d.id || 0)) + 1
          : 1;
      const driverToAdd = { ...newDriver, id: newId };
      drivers.value.push(driverToAdd);
      console.log('Driver added:', driverToAdd);
    };

    const deleteDriverById = (driverId) => {
      const initialLength = drivers.value.length;
      drivers.value = drivers.value.filter((driver) => driver.id !== driverId);
      if (initialLength > drivers.value.length) {
        console.log('Driver deleted with id:', driverId);
        return true;
      }
      console.warn('Driver not found for deletion with id:', driverId);
      return false;
    };

    const updateDriver = (updatedDriver) => {
      if (!updatedDriver || !updatedDriver.id) {
        console.error('Cannot update driver: ID is missing in updated data.');
        return false;
      }
      const index = drivers.value.findIndex(
        (driver) => driver.id === updatedDriver.id
      );
      if (index !== -1) {
        drivers.value[index] = {
          ...drivers.value[index],
          ...updatedDriver,
          id: drivers.value[index].id,
        };
        console.log('Driver updated:', drivers.value[index]);
        return true;
      }
      console.warn('Driver not found for update with id:', updatedDriver.id);
      return false;
    };

    const fetchDrivers = async () => {
      console.log('Fetching drivers...');

      if (drivers.value.length === 0) {
      }
    };

    return {
      drivers,
      driverCount,
      getDriverById,
      addDriver,
      deleteDriverById,
      updateDriver,
      fetchDrivers,
    };
  },
  {
    persist: true,
  }
);
