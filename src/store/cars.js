import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCarStore = defineStore(
  'cars',
  () => {
    const cars = ref([]);

    const carCount = computed(() => cars.value.length);

    const getCarById = computed(() => {
      return (carId) => cars.value.find((car) => car.id === carId);
    });

    const addCar = (newCar) => {
      const newId =
        cars.value.length > 0
          ? Math.max(...cars.value.map((c) => c.id || 0)) + 1
          : 1;
      const carToAdd = { ...newCar, id: newId };
      cars.value.push(carToAdd);
      console.log('Car added:', carToAdd);
    };

    const deleteCar = (carId) => {
      const initialLength = cars.value.length;
      cars.value = cars.value.filter((car) => car.id !== carId);
      if (initialLength > cars.value.length) {
        console.log('Car deleted with id:', carId);
        return true;
      }
      console.warn('Car not found for deletion with id:', carId);
      return false;
    };

    const updateCar = (updatedCar) => {
      if (!updatedCar || !updatedCar.id) {
        console.error('Cannot update car: ID is missing in updated data.');
        return false;
      }
      const index = cars.value.findIndex((car) => car.id === updatedCar.id);
      if (index !== -1) {
        cars.value[index] = {
          ...cars.value[index],
          ...updatedCar,
          id: cars.value[index].id,
        };
        console.log('Car updated:', cars.value[index]);
        return true;
      }
      console.warn('Car not found for update with id:', updatedCar.id);
      return false;
    };

    const fetchCars = async () => {
      if (cars.value.length > 0) {
        console.log(
          'Cars already loaded via persist/previous fetch, count:',
          cars.value.length
        );
        return;
      }

      console.log('Executing fetchCars action...');

      if (cars.value.length === 0) {
        console.log('Using dummy car data for fetchCars.');
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Dummy cars loaded:', cars.value.length);
      }
    };

    return {
      cars,
      carCount,
      getCarById,
      addCar,
      deleteCar,
      updateCar,
      fetchCars,
    };
  },
  {
    persist: true,
  }
);
