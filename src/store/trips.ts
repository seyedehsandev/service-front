import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Trip } from '@/types';

export const useTripStore = defineStore('trips', () => {
  const trips = ref<Trip[]>([]);

  const tripCount = computed(() => trips.value.length);

  const getTripById = computed(() => {
    return (tripId: number) => trips.value.find((trip) => trip.id === tripId);
  });

  const setTripsFromQuery = (tripsData: Trip[]) => {
    trips.value = tripsData || [];
  };

  return {
    trips,
    tripCount,
    getTripById,
    setTripsFromQuery,
  };
});
