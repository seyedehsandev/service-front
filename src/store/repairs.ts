import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { RepairHistory } from '@/types';

export const useRepairHistoryStore = defineStore(
  'repairHistories',
  () => {
    const repairHistories = ref<RepairHistory[]>([]);

    const historyCount = computed(() => repairHistories.value.length);

    const getHistoryById = computed(() => {
      return (historyId: number) =>
        repairHistories.value.find((h) => h.id === historyId);
    });

    const addRepairHistory = (newRepair: Omit<RepairHistory, 'id'>) => {
      const newId =
        repairHistories.value.length > 0
          ? Math.max(...repairHistories.value.map((h) => h.id)) + 1
          : 1;
      const historyToAdd: RepairHistory = { ...newRepair, id: newId };
      repairHistories.value.push(historyToAdd);
      return historyToAdd;
    };

    const deleteRepairHistory = (historyId: number) => {
      const initialLength = repairHistories.value.length;
      repairHistories.value = repairHistories.value.filter(
        (h) => h.id !== historyId
      );
      return initialLength > repairHistories.value.length;
    };

    const updateRepairHistory = (updatedHistory: RepairHistory) => {
      if (!updatedHistory || !updatedHistory.id) {
        return false;
      }
      const index = repairHistories.value.findIndex(
        (h) => h.id === updatedHistory.id
      );
      if (index !== -1) {
        repairHistories.value[index] = { ...updatedHistory };
        return true;
      }
      return false;
    };

    const fetchRepairHistories = async () => {
      console.log('Fetching repair histories...');
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
