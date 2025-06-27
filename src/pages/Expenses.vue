<template>
  <div dir="rtl" class="font-vazir">
    <div class="w-screen min-h-screen flex rounded-md bg-gray-50">
      <div class="w-full px-4 md:px-8">
        <header class="border-b border-gray-200">
          <h1 class="text-2xl md:text-3xl py-4 px-2 font-bold text-gray-800">
            {{ editingExpenseId ? 'ویرایش هزینه' : 'ثبت هزینه‌های جانبی' }}
          </h1>
        </header>

        <form class="bg-white rounded-xl shadow-md p-6 mt-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-700"
                >نوع هزینه <span class="text-red-500">*</span></label
              >
              <select
                v-model="newExpense.type"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option
                  v-for="category in expenseCategories"
                  :key="category.value"
                  :value="category.value"
                >
                  {{ category.label }}
                </option>
              </select>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-700"
                >مبلغ (تومان) <span class="text-red-500">*</span></label
              >
              <input
                type="number"
                v-model.number="newExpense.amount"
                min="0"
                required
                placeholder="مبلغ هزینه را وارد کنید"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-700"
                >تاریخ <span class="text-red-500">*</span></label
              >
              <DatePicker
                v-model="newExpense.date"
                input-class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-700"
                >مرتبط با خودرو</label
              >
              <select
                v-model="newExpense.carId"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option :value="null">هیچکدام / هزینه عمومی</option>
                <option v-for="car in cars" :key="car.id" :value="car.id">
                  {{ car.brand }} {{ car.model }} ({{ car.plate }})
                </option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="text-sm font-medium text-gray-700">توضیحات</label>
              <textarea
                v-model="newExpense.description"
                rows="3"
                placeholder="جزئیات بیشتر در مورد هزینه..."
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          <div class="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              @click.prevent="handleSubmit"
              class="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow hover:shadow-md"
            >
              {{ editingExpenseId ? 'بروزرسانی هزینه' : 'ثبت هزینه' }}
            </button>
            <button
              v-if="editingExpenseId"
              @click.prevent="resetForm"
              type="button"
              class="flex-grow sm:flex-grow-0 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              لغو ویرایش
            </button>
          </div>
        </form>

        <div
          class="rounded-xl overflow-hidden border border-gray-200 shadow-sm mt-10 mb-8 bg-white"
        >
          <h2
            class="text-lg font-semibold text-gray-700 p-4 border-b border-gray-200"
          >
            لیست هزینه‌ها
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full min-w-[600px]">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    class="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    نوع
                  </th>
                  <th
                    class="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    مبلغ
                  </th>
                  <th
                    class="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    تاریخ
                  </th>
                  <th
                    class="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    خودرو
                  </th>
                  <th
                    class="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    توضیحات
                  </th>
                  <th
                    class="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-if="expenses.length === 0">
                  <td colspan="6" class="text-center py-6 text-gray-500">
                    هنوز هیچ هزینه‌ای ثبت نشده است.
                  </td>
                </tr>
                <tr
                  v-for="expense in expenses"
                  :key="expense.id"
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td class="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {{ getCategoryLabel(expense.type) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {{ expense.amount?.toLocaleString() ?? '0' }} تومان
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {{ formatDate(expense.date) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {{
                      expense.carId
                        ? cars.find((c) => c.id === expense.carId)?.plate ||
                          `ID: ${expense.carId}`
                        : '-'
                    }}
                  </td>
                  <td
                    class="px-4 py-3 text-sm text-gray-500 max-w-xs truncate"
                    :title="expense.description"
                  >
                    {{ expense.description || '-' }}
                  </td>
                  <td class="px-4 py-3 text-sm text-center whitespace-nowrap">
                    <button
                      @click="editExpense(expense)"
                      class="text-blue-500 hover:text-blue-700 p-1 mx-1 transition-colors"
                      title="ویرایش هزینه"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        ></path>
                      </svg>
                    </button>
                    <button
                      @click="deleteExpense(expense.id)"
                      class="text-red-500 hover:text-red-700 p-1 mx-1 transition-colors"
                      title="حذف هزینه"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot
                v-if="expenses.length > 0"
                class="bg-gray-50 border-t border-gray-200"
              >
                <tr>
                  <td class="px-4 py-3 text-sm font-semibold text-gray-700">
                    مجموع:
                  </td>
                  <td class="px-4 py-3 text-sm font-semibold text-gray-700">
                    {{ totalExpenseAmount?.toLocaleString() ?? '0' }} تومان
                  </td>
                  <td colspan="4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useCarStore } from './../store/cars.js';
import { useExpenseStore } from '../store/expenses';
import { storeToRefs } from 'pinia';
import DatePicker from 'vue3-persian-datetime-picker';

const expenseStore = useExpenseStore();
const carStore = useCarStore();

const { expenses } = storeToRefs(expenseStore);
const { cars } = storeToRefs(carStore);

const { addExpense, deleteExpense, updateExpense, fetchExpenses } =
  expenseStore;
const { fetchCars } = carStore;

const expenseCategories = [
  { value: 'insurance', label: 'بیمه' },
  { value: 'parking', label: 'پارکینگ' },
  { value: 'fine', label: 'جریمه' },
  { value: 'repair', label: 'تعمیرات' },
  { value: 'inspection', label: 'معاینه فنی' },
  { value: 'toll', label: 'عوارضی' },
  { value: 'other', label: 'سایر' },
];

const newExpense = ref({
  type: expenseCategories[0].value,
  amount: null,
  date: new Date().toISOString().split('T')[0],
  carId: null,
  description: '',
});

const editingExpenseId = ref(null);

const getCategoryLabel = (value) => {
  return (
    expenseCategories.find((c) => c.value === value)?.label || value || 'نامشخص'
  );
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch (e) {
    return dateString;
  }
};

function resetForm() {
  newExpense.value = {
    type: expenseCategories[0].value,
    amount: null,
    date: new Date().toISOString().split('T')[0],
    carId: null,
    description: '',
  };
  editingExpenseId.value = null;
}

const handleSubmit = () => {
  if (
    !newExpense.value.amount ||
    newExpense.value.amount <= 0 ||
    !newExpense.value.date ||
    !newExpense.value.type
  ) {
    alert('لطفا نوع، مبلغ و تاریخ هزینه را به درستی وارد کنید.');
    return;
  }

  if (editingExpenseId.value !== null) {
    console.log('Updating expense with ID:', editingExpenseId.value);
    updateExpense({ ...newExpense.value, id: editingExpenseId.value });
  } else {
    console.log('Adding new expense');
    addExpense({ ...newExpense.value });
  }

  resetForm();
};

function editExpense(expenseItem) {
  console.log('Editing expense:', expenseItem);
  editingExpenseId.value = expenseItem.id;
  newExpense.value = {
    type: expenseItem.type,
    amount: expenseItem.amount,
    date: expenseItem.date,
    carId: expenseItem.carId || null,
    description: expenseItem.description || '',
  };
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(() => {
  console.log('Expense component mounted');
  if (cars.value.length === 0) {
    console.log('Fetching cars for dropdown...');
    // fetchCars();
  }
  if (expenses.value.length === 0) {
    console.log('Fetching expenses...');
    // fetchExpenses();
  }

  if (!newExpense.value.date) {
    newExpense.value.date = new Date().toISOString().split('T')[0];
  }
});
</script>
