import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useExpenseStore = defineStore(
  'expenses',
  () => {
    const expenses = ref([]);

    const expenseCount = computed(() => expenses.value.length);

    const totalExpenseAmount = computed(() => {
      return expenses.value.reduce((sum, expense) => {
        const amount = Number(expense.amount);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
    });

    const getExpenseById = computed(() => {
      return (expenseId) => expenses.value.find((exp) => exp.id === expenseId);
    });

    const addExpense = (newExpense) => {
      const newId =
        expenses.value.length > 0
          ? Math.max(...expenses.value.map((e) => e.id || 0)) + 1
          : 1;
      const expenseToAdd = { ...newExpense, id: newId };
      expenses.value.push(expenseToAdd);
      console.log('Expense added. Total count:', expenses.value.length);
    };

    const deleteExpense = (expenseId) => {
      const initialLength = expenses.value.length;
      expenses.value = expenses.value.filter((e) => e.id !== expenseId);
      if (expenses.value.length < initialLength) {
        console.log('Expense deleted with id:', expenseId);
        return true;
      } else {
        console.warn('Expense not found for deletion with id:', expenseId);
        return false;
      }
    };

    const updateExpense = (updatedExpense) => {
      if (!updatedExpense || !updatedExpense.id) {
        console.error('Cannot update expense: ID is missing in updated data.');
        return false;
      }
      const index = expenses.value.findIndex((e) => e.id === updatedExpense.id);
      if (index !== -1) {
        expenses.value[index] = {
          ...expenses.value[index],
          ...updatedExpense,
          id: expenses.value[index].id,
        };
        console.log('Expense updated:', expenses.value[index]);
        return true;
      } else {
        console.warn(
          'Expense not found for update with id:',
          updatedExpense.id
        );
        return false;
      }
    };

    // const fetchExpenses = async () => {
    //   console.log('Fetching expenses...');

    //   if (expenses.value.length === 0) {
    //   }
    // };

    return {
      expenses,
      expenseCount,
      totalExpenseAmount,
      getExpenseById,
      addExpense,
      deleteExpense,
      updateExpense,
      //   fetchExpenses,
    };
  },
  {
    persist: true,
  }
);
