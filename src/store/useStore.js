import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useStore = defineStore(
  'store',
  () => {
    // State
    const reports = ref([]);
    const trips = ref([]);
    const repairHistories = ref([]);

    // Actions

    const addTrip = (newTrip) => trips.value.push(newTrip);
    const updateTrip = (index, newTrip) =>
      trips.value.splice(index, 1, newTrip);
    const deleteTrip = (index) => trips.value.splice(index, 1);
    const addRepairHistories = (newRepair) =>
      repairHistories.value.push(newRepair);

    return {
      reports,
      trips,
      repairHistories,
      addTrip,
      updateTrip,
      deleteTrip,
      addRepairHistories,
    };
  },
  { persist: true }
);
