<template>
    <div dir="rtl" class="font-vazir">
      <div class="w-screen min-h-screen flex rounded-md bg-gray-50">
        <div class="w-full px-4 md:px-8">
          <header class="border-b border-gray-200">
            <h1 class="text-2xl md:text-3xl py-4 px-2 font-bold text-gray-800">ثبت هزینه‌های جانبی</h1>
          </header>
  
          <form class="bg-white rounded-xl shadow-md p-6 mt-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">نوع هزینه <span class="text-red-500">*</span></label>
                <select 
                  v-model="newExpense.type"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                >
                  <option 
                    v-for="(category, index) in expenseCategories" 
                    :key="index" 
                    :value="category.value"
                  >
                    {{ category.label }}
                  </option>
                </select>
              </div>
  
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">مبلغ (تومان) <span class="text-red-500">*</span></label>
                <input
                  type="number"
                  v-model="newExpense.amount"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                >
              </div>
  
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">تاریخ <span class="text-red-500">*</span></label>
                <DatePicker v-model="newExpense.date"></DatePicker>
              </div>
  
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">مرتبط با خودرو</label>
                <select 
                  v-model="newExpense.carPlate"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">بدون وابستگی</option>
                  <option 
                    v-for="car in cars" 
                    :key="car.plate" 
                    :value="car.plate"
                  >
                    {{ car.brand }} {{ car.model }} ({{ car.plate }})
                  </option>
                </select>
              </div>
  
              <!-- توضیحات -->
              <div class="md:col-span-2">
                <label class="text-sm font-medium text-gray-700">توضیحات</label>
                <textarea
                  v-model="newExpense.description"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 h-24"
                ></textarea>
              </div>
            </div>
  
            <button 
              @click.prevent="handleSubmit"
              class="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              ثبت هزینه
            </button>
          </form>
  
          <div class="rounded-xl overflow-hidden border border-gray-200 shadow-sm mt-8 bg-white">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-4 py-3 text-right text-sm font-medium text-gray-500">نوع</th>
                  <th class="px-4 py-3 text-right text-sm font-medium text-gray-500">مبلغ</th>
                  <th class="px-4 py-3 text-right text-sm font-medium text-gray-500">تاریخ</th>
                  <th class="px-4 py-3 text-right text-sm font-medium text-gray-500">خودرو</th>
                  <th class="px-4 py-3 text-right text-sm font-medium text-gray-500">عملیات</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr 
                  v-for="(expense, index) in expenses" 
                  :key="expense.id"
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ getCategoryLabel(expense.type) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ expense.amount.toLocaleString() }} تومان
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ formatDate(expense.date) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ expense.carPlate || '-' }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    <button 
                      @click="editExpense(index)"
                      class="text-blue-500 hover:text-blue-700 mx-2"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      @click="deleteExpense(expense.id)"
                      class="text-red-500 hover:text-red-700 mx-2"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useStore } from '../store/useStore';
  import { storeToRefs } from 'pinia';
  import DatePicker from 'vue3-persian-datetime-picker';

  
  const store = useStore();
  const { expenses, cars } = storeToRefs(store);
  const { addExpense, deleteExpense, updateExpense } = store;
  
  const expenseCategories = [
    { value: 'insurance', label: 'بیمه' },
    { value: 'parking', label: 'پارکینگ' },
    { value: 'fine', label: 'جریمه' },
    { value: 'repair', label: 'تعمیرات' },
    { value: 'inspection', label: 'معاینه فنی' },
    { value: 'toll', label: 'عوارضی' },
    { value: 'other', label: 'سایر' }
  ];
  
  const newExpense = ref({
    type: 'insurance',
    amount: 0,
    date: "",
    carPlate: '',
    description: ''
  });
  
  const getCategoryLabel = (value) => {
    return expenseCategories.find(c => c.value === value)?.label || 'نامشخص';
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };
  
  const handleSubmit = () => {
    if(newExpense.value.amount > 0) {
      addExpense({
        ...newExpense.value,
        id: Date.now()
      });
      newExpense.value = {
        type: 'insurance',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        carPlate: '',
        description: ''
      };
    }
    console.log("handle")
  };
  
  const editExpense = (index) => {
    const expense = expenses.value[index];
    newExpense.value = { ...expense };
  };
  </script>