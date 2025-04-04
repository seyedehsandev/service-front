import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRepairStore = defineStore(
  'store',
  () => {
    const repairHistories = ref([]);

    const addRepairHistories = (newRepair) =>
      repairHistories.value.push(newRepair);

    return {
      repairHistories,
      addRepairHistories,
    };
  },
  { persist: true }
);
