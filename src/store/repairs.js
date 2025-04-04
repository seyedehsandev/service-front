import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useRepairHistoryStore = defineStore(
  'repairHistories',
  () => {
    const repairHistories = ref([]);

    const historyCount = computed(() => repairHistories.value.length);

    const getHistoryById = computed(() => {
      return (historyId) =>
        repairHistories.value.find((h) => h.id === historyId);
    });

    const addRepairHistory = (newRepair) => {
      const newId =
        repairHistories.value.length > 0
          ? Math.max(...repairHistories.value.map((h) => h.id || 0)) + 1
          : 1;
      const historyToAdd = { ...newRepair, id: newId };
      repairHistories.value.push(historyToAdd);
      console.log('Repair history added:', historyToAdd);
      return historyToAdd;
    };

    const deleteRepairHistory = (historyId) => {
      const initialLength = repairHistories.value.length;
      repairHistories.value = repairHistories.value.filter(
        (h) => h.id !== historyId
      );
      if (initialLength > repairHistories.value.length) {
        console.log('Repair history deleted with id:', historyId);
        return true;
      }
      console.warn('Repair history not found for deletion with id:', historyId);
      return false;
    };

    const updateRepairHistory = (updatedHistory) => {
      if (!updatedHistory || !updatedHistory.id) {
        console.error('Cannot update repair history: ID is missing.');
        return false;
      }
      const index = repairHistories.value.findIndex(
        (h) => h.id === updatedHistory.id
      );
      if (index !== -1) {
        repairHistories.value[index] = {
          ...repairHistories.value[index],
          ...updatedHistory,
          id: repairHistories.value[index].id,
        };
        console.log('Repair history updated:', repairHistories.value[index]);
        return true;
      }
      console.warn(
        'Repair history not found for update with id:',
        updatedHistory.id
      );
      return false;
    };

    const fetchRepairHistories = async () => {
      console.log('Fetching repair histories...');

      if (repairHistories.value.length === 0) {
        console.log('Dummy repair histories loaded.');
      }
    };

    return {
      repairHistories,
      historyCount,
      getHistoryById,
      addRepairHistory,
      deleteRepairHistory,
      updateRepairHistory,
      fetchRepairHistories,
    };
  },
  { persist: true }
);
