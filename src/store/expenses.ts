import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Expense } from '@/types';

export const useExpenseStore = defineStore(
  'expenses',
  () => {
    const expenses = ref<Expense[]>([]);

    const expenseCount = computed(() => expenses.value.length);

    const totalExpenseAmount = computed(() => {
      return expenses.value.reduce((sum, expense) => {
        const amount = Number(expense.amount);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
    });

    const getExpenseById = computed(() => {
      return (expenseId: number) =>
        expenses.value.find((exp) => exp.id === expenseId);
    });

    const addExpense = (newExpense: Omit<Expense, 'id'>) => {
      const newId =
        expenses.value.length > 0
          ? Math.max(...expenses.value.map((e) => e.id)) + 1
          : 1;
      const expenseToAdd: Expense = { ...newExpense, id: newId };
      expenses.value.push(expenseToAdd);
    };

    const deleteExpense = (expenseId: number) => {
      const initialLength = expenses.value.length;
      expenses.value = expenses.value.filter((e) => e.id !== expenseId);
      if (expenses.value.length < initialLength) {
        return true;
      }
      return false;
    };

    const updateExpense = (updatedExpense: Expense) => {
      if (!updatedExpense || !updatedExpense.id) {
        return false;
      }
      const index = expenses.value.findIndex((e) => e.id === updatedExpense.id);
      if (index !== -1) {
        expenses.value[index] = { ...updatedExpense };
        return true;
      }
      return false;
    };

    return {
      expenses,
      expenseCount,
      totalExpenseAmount,
      getExpenseById,
      addExpense,
      deleteExpense,
      updateExpense,
    };
  },
  {
    persist: true,
  }
);
