import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTripStore = defineStore('trips', () => {
  const trips = ref([]);

  const tripCount = computed(() => trips.value.length);

  const getTripById = computed(() => {
    return (tripId) => trips.value.find((trip) => trip.id === tripId);
  });

  const setTripsFromQuery = (tripsData) => {
    trips.value = tripsData || [];
  };

  return {
    trips,
    tripCount,
    getTripById,
    setTripsFromQuery,
  };
});
