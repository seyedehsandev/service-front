import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTripStore = defineStore(
  'trips',
  () => {
    const trips = ref([]);

    const tripCount = computed(() => trips.value.length);

    const getTripById = computed(() => {
      return (tripId) => trips.value.find((trip) => trip.id === tripId);
    });

    const addTrip = (newTrip) => {
      const newId =
        trips.value.length > 0
          ? Math.max(...trips.value.map((t) => t.id || 0)) + 1
          : 1;
      const tripToAdd = { ...newTrip, id: newId };
      trips.value.push(tripToAdd);
      console.log('Trip added:', tripToAdd);
    };

    const updateTripById = (updatedTrip) => {
      if (!updatedTrip || !updatedTrip.id) {
        console.error('Cannot update trip: ID is missing in updated data.');
        return false;
      }
      const index = trips.value.findIndex((trip) => trip.id === updatedTrip.id);
      if (index !== -1) {
        trips.value[index] = {
          ...trips.value[index],
          ...updatedTrip,
          id: trips.value[index].id,
        };
        console.log('Trip updated:', trips.value[index]);
        return true;
      }
      console.warn('Trip not found for update with id:', updatedTrip.id);
      return false;
    };

    const deleteTripById = (tripId) => {
      const initialLength = trips.value.length;
      trips.value = trips.value.filter((trip) => trip.id !== tripId);
      if (initialLength > trips.value.length) {
        console.log('Trip deleted with id:', tripId);
        return true;
      }
      console.warn('Trip not found for deletion with id:', tripId);
      return false;
    };

    const fetchTrips = async () => {
      console.log('Fetching trips...');

      if (trips.value.length === 0) {
      }
    };

    return {
      trips,
      tripCount,
      getTripById,
      addTrip,
      updateTripById,
      deleteTripById,
      fetchTrips,
    };
  },
  {
    persist: true,
  }
);
