import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useStore = defineStore(
  'store',
  () => {
    // State
    const reports = ref([]);
    const trips = ref([]);
    const expenses = ref([]);
    const repairHistories = ref([]);

    // Actions

    const addExpense = (expense) => {
      expenses.value.push(expense);
      console.log(expenses.value.length);
    };

    const deleteExpense = (id) => {
      expenses.value = expenses.value.filter((e) => e.id !== id);
    };

    const updateExpense = (updatedExpense) => {
      const index = expenses.value.findIndex((e) => e.id === updatedExpense.id);
      if (index !== -1) {
        expenses.value[index] = updatedExpense;
      }
    };

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
      expenses,
      addTrip,
      updateTrip,
      deleteTrip,
      addRepairHistories,
      deleteExpense,
      addExpense,
      updateExpense,
    };
  },
  { persist: true }
);
