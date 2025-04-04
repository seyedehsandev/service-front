<template>
  <div dir="rtl" class="font-vazir">
    <div class="w-screen min-h-screen flex rounded-md bg-gray-50">
      <div class="w-full px-4 md:px-8">
        <header class="border-b border-gray-200">
          <h1 class="text-2xl md:text-3xl py-4 px-2 font-bold text-gray-800">
            لیست سوابق تعمیرات
          </h1>
        </header>

        <main
          class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between px-2 py-6"
        >
          <div class="order-2 md:order-1">
            <button
              @click="
                isFormOpen = true;
                resetForm();
              "
              class="bg-gradient-to-r from-green-400 to-green-500 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-white font-medium flex items-center gap-2"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              ایجاد سابقه جدید
            </button>
          </div>

          <div
            class="order-1 md:order-2 bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-100"
          >
            <span class="text-gray-600">
              تعداد کل سوابق:
              <span class="font-bold text-blue-600">{{ historyCount }}</span>
            </span>
          </div>
        </main>

        <div
          class="rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-8 bg-white"
        >
          <div class="overflow-x-auto">
            <table class="w-full min-w-[800px]">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    v-for="(header, index) in [
                      'راننده',
                      'مدل خودرو',
                      'نوع خودرو',
                      'نوع تعمیرات',
                      'هزینه تعمیرات (تومان)',
                      'تاریخ',
                      'ویرایش',
                      'حذف',
                    ]"
                    :key="index"
                    class="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-if="repairHistories.length === 0">
                  <td colspan="8" class="text-center py-6 text-gray-500">
                    هیچ سابقه تعمیری ثبت نشده است.
                  </td>
                </tr>
                <tr
                  v-for="item in repairHistories"
                  :key="item.id"
                  class="hover:bg-gray-50 transition-colors duration-150 text-sm"
                >
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{ item.driver }}
                  </td>
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{ item.model }}
                  </td>
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{ item.type }}
                  </td>
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{ item.repairType }}
                  </td>
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{ item.cost?.toLocaleString() ?? '0' }}
                  </td>
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{
                      item.date
                        ? new Date(item.date).toLocaleDateString('fa-IR')
                        : '-'
                    }}
                  </td>
                  <td class="px-4 py-3 text-center whitespace-nowrap">
                    <button
                      @click="editData(item)"
                      class="text-blue-500 hover:text-blue-700 p-1 mx-1 transition-colors"
                      title="ویرایش"
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
                      @click="DeleteItem(item)"
                      class="text-red-500 hover:text-red-700 p-1 mx-1 transition-colors"
                      title="حذف"
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
            </table>
          </div>
        </div>

        <transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="isFormOpen"
            class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            @click="isFormOpen = false"
          ></div>
        </transition>
        <transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <form
            v-if="isFormOpen"
            @submit.prevent="submitting"
            class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white flex flex-col p-6 md:p-8 gap-y-5 rounded-2xl shadow-xl border border-gray-100 w-[95%] max-w-2xl max-h-[90vh]"
          >
            <div class="flex justify-between items-center pb-4 border-b mb-2">
              <h2 class="font-bold text-xl text-gray-800">
                {{
                  editingHistoryId
                    ? 'ویرایش سابقه تعمیرات'
                    : 'افزودن سابقه تعمیرات'
                }}
              </h2>
              <button
                @click="
                  isFormOpen = false;
                  resetForm();
                "
                type="button"
                class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div class="overflow-y-auto pr-2 -mr-2">
              <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700"
                    >نام راننده</label
                  >
                  <input
                    type="text"
                    v-model.trim="repairData.driver"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700"
                    >مدل خودرو</label
                  >
                  <input
                    type="text"
                    v-model.trim="repairData.model"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700"
                    >نوع خودرو</label
                  >
                  <input
                    type="text"
                    v-model.trim="repairData.type"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700"
                    >نوع تعمیرات <span class="text-red-500">*</span></label
                  >
                  <input
                    type="text"
                    v-model.trim="repairData.repairType"
                    required
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700"
                    >هزینه تعمیرات (تومان)
                    <span class="text-red-500">*</span></label
                  >
                  <input
                    type="number"
                    v-model.number="repairData.cost"
                    required
                    min="0"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700"
                    >تاریخ تعمیرات <span class="text-red-500">*</span></label
                  >
                  <DatePicker
                    v-model="repairData.date"
                    format="YYYY-MM-DD"
                    display-format="jYYYY/jMM/jDD"
                    input-class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>
            </div>

            <div class="pt-5 border-t mt-5">
              <button
                type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow hover:shadow-md"
              >
                {{ editingHistoryId ? 'بروزرسانی سابقه' : 'تایید اطلاعات' }}
              </button>
            </div>
          </form>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useRepairHistoryStore } from '../store/repairs';
import { storeToRefs } from 'pinia';
import DatePicker from 'vue3-persian-datetime-picker';

const isFormOpen = ref(false);
const editingHistoryId = ref(null);

const repairHistoryStore = useRepairHistoryStore();

const { repairHistories, historyCount } = storeToRefs(repairHistoryStore);

const {
  addRepairHistory,
  deleteRepairHistory,
  updateRepairHistory,
  fetchRepairHistories,
} = repairHistoryStore;

const repairData = reactive({
  driver: '',
  model: '',
  type: '',
  repairType: '',
  cost: null,
  date: new Date().toISOString(),
});

// تابع ریست فرم
function resetForm() {
  Object.assign(repairData, {
    driver: '',
    model: '',
    type: '',
    repairType: '',
    cost: null,
    date: new Date().toISOString(),
  });
  editingHistoryId.value = null;
}

function submitting() {
  if (
    !repairData.repairType ||
    !repairData.cost ||
    repairData.cost <= 0 ||
    !repairData.date
  ) {
    alert('لطفا نوع تعمیرات، هزینه و تاریخ را به درستی وارد کنید.');
    return;
  }

  if (editingHistoryId.value !== null) {
    console.log('Updating repair history with ID:', editingHistoryId.value);
    updateRepairHistory({
      ...repairData,
      id: editingHistoryId.value,
      lastEdit: new Date().toISOString(),
    });
  } else {
    console.log('Adding new repair history');
    addRepairHistory({ ...repairData, lastEdit: new Date().toISOString() });
  }
  resetForm();
  isFormOpen.value = false;
}

function populateForm(historyItem) {
  Object.assign(repairData, historyItem);
}

function editData(historyItem) {
  editingHistoryId.value = historyItem.id;
  populateForm(historyItem);
  isFormOpen.value = true;
}

function DeleteItem(historyItem) {
  if (
    confirm(
      `آیا از حذف سابقه تعمیر برای راننده ${historyItem.driver} مطمئن هستید؟`
    )
  ) {
    console.log('Deleting repair history with ID:', historyItem.id);
    deleteRepairHistory(historyItem.id);
  }
}

onMounted(() => {
  console.log('Repair History component mounted');
  if (repairHistories.value.length === 0) {
    console.log('Fetching repair histories...');
    fetchRepairHistories();
  }
  if (!repairData.date) {
    repairData.date = new Date().toISOString();
  }
});
</script>

<style scoped></style>
