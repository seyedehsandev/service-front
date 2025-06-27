<template>
  <div dir="rtl" class="font-vazir">
    <div class="w-screen min-h-screen flex rounded-md bg-gray-50">
      <div class="w-full px-4 md:px-8">
        <header class="border-b border-gray-200 flex items-center gap-x-2">
          <router-link to="/dashboard">
            <img src="/favicon.png" alt="" class="w-10 h-10" />
          </router-link>
          <h1 class="text-2xl md:text-3xl py-4 px-2 font-bold text-gray-800">
            لیست رانندگان
          </h1>
        </header>
        <main
          class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between px-2 py-6"
        >
          <div class="order-2 md:order-1">
            <button
              @click="openAddForm"
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
              افزودن راننده
            </button>
          </div>

          <div
            class="order-1 md:order-2 bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-100"
          >
            <span class="text-gray-600">
              تعداد کل راننده‌ها:
              <span class="font-bold text-blue-600">{{
                driversQuery.data?.value?.length ?? 0
              }}</span>
            </span>
          </div>
        </main>

        <div v-if="driversQuery.isLoading.value" class="text-center py-10">
          در حال بارگذاری اطلاعات رانندگان...
        </div>

        <div
          v-else-if="driversQuery.isError.value"
          class="text-center py-10 text-red-600"
        >
          خطا در دریافت اطلاعات: {{ driversQuery.error.value?.message }}
        </div>

        <div
          v-else-if="
            driversQuery.data.value && driversQuery.data.value.length > 0
          "
          class="rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-8 bg-white"
        >
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  v-for="(header, index) in [
                    'نام',
                    'نام خانوادگی',
                    'انقضا گواهینامه',
                    'شماره تلفن',
                    'کد پرسنلی',
                    'ویرایش',
                    'حذف',
                  ]"
                  :key="index"
                  class="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="item in driversQuery.data.value"
                :key="item.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.name }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.lastName }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ formatDate(item.licenseExpireDate) }}
                </td>
                <td class="px-4 py-3 text-sm text-blue-600 font-medium">
                  {{ item.phoneNumber }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.personalCode }}
                </td>
                <td class="px-4 py-3">
                  <button
                    @click="openEditForm(item)"
                    class="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 rounded-md text-white hover:shadow-md transition-all duration-200 text-sm"
                  >
                    ویرایش
                  </button>
                </td>
                <td class="px-4 py-3">
                  <button
                    @click="
                      confirmDelete(item.documentId, item.name, item.lastName)
                    "
                    :disabled="
                      deleteMutation.isPending.value &&
                      deletingDocumentId === item.documentId
                    "
                    class="bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 rounded-md text-white hover:shadow-md transition-all duration-200 text-sm flex items-center gap-1 disabled:opacity-50"
                  >
                    <svg
                      v-if="
                        !(
                          deleteMutation.isPending.value &&
                          deletingDocumentId === item.documentId
                        )
                      "
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span v-else>...</span>
                    حذف
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-10 text-gray-500">
          داده‌ای برای نمایش وجود ندارد.
        </div>

        <div
          v-if="isFormOpen"
          class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40"
          @click.self="closeForm"
        >
          <form
            class="bg-white backdrop-blur-md flex flex-col p-8 gap-y-4 rounded-2xl relative shadow-xl border border-gray-100"
            style="width: 95%; max-width: 640px"
            @submit.prevent="handleSubmit"
          >
            <button
              @click="closeForm"
              type="button"
              class="absolute top-4 left-4 bg-red-100 hover:bg-red-200 p-1.5 rounded-full transition-colors"
            >
              <svg
                class="w-6 h-6 text-red-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18 17.94 6M18 18 6.06 6"
                />
              </svg>
            </button>

            <h2 class="font-bold text-2xl text-gray-800 mb-4">
              {{
                editingDriverDocumentId
                  ? 'ویرایش مشخصات راننده'
                  : 'افزودن راننده جدید'
              }}
            </h2>

            <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">نام</label>
                <input
                  type="text"
                  v-model="driverData.name"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700"
                  >نام خانوادگی <span class="text-red-500">*</span></label
                >
                <input
                  type="text"
                  v-model="driverData.lastName"
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700"
                  >تاریخ انقضا گواهینامه
                  <span class="text-red-500">*</span></label
                >
                <DatePicker
                  v-model="driverData.licenseExpireDate"
                  format="YYYY-MM-DD"
                  display-format="jYYYY/jMM/jDD"
                  required
                  input-class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none h-[42px]"
                  placeholder="تاریخ انقضا گواهینامه"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700"
                  >شماره تلفن</label
                >
                <input
                  type="text"
                  v-model="driverData.phoneNumber"
                  placeholder="09121122333"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700"
                  >کد پرسنلی</label
                >
                <input
                  type="number"
                  v-model="driverData.personalCode"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="
                addMutation.isPending.value || updateMutation.isPending.value
              "
              class="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              <span
                v-if="
                  addMutation.isPending.value || updateMutation.isPending.value
                "
              >
                در حال پردازش...
              </span>
              <span v-else>
                {{
                  editingDriverDocumentId ? 'بروزرسانی اطلاعات' : 'ثبت اطلاعات'
                }}
              </span>
            </button>
            <p
              v-if="addMutation.isError.value || updateMutation.isError.value"
              class="text-red-500 text-sm mt-2 text-center"
            >
              خطا در ثبت اطلاعات:
              {{
                addMutation.error?.value?.response?.data?.error?.message ||
                addMutation.error?.value?.message ||
                updateMutation.error?.value?.response?.data?.error?.message ||
                updateMutation.error?.value?.message ||
                'خطای نامشخص'
              }}
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import axios from 'axios';
import DatePicker from 'vue3-persian-datetime-picker';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const STRAPI_API_URL = import.meta.env.VITE_STRAPI_API_URL;
const API_ENDPOINT = `${STRAPI_API_URL}/api/drivers`;

const queryClient = useQueryClient();
const notyf = new Notyf({
  duration: 4000,
  position: { x: 'left', y: 'bottom' },
  dismissible: true,
});

const isFormOpen = ref(false);
const editingDriverDocumentId = ref(null);
const deletingDocumentId = ref(null);

const initialDriverData = {
  name: '',
  lastName: '',
  licenseExpireDate: '',
  phoneNumber: '',
  personalCode: '',
};
const driverData = reactive({ ...initialDriverData });

const fetchDriversAPI = async () => {
  try {
    const response = await axios.get(API_ENDPOINT);
    let drivers = [];
    if (Array.isArray(response.data?.data)) {
      drivers = response.data.data;
    } else if (Array.isArray(response.data)) {
      drivers = response.data;
    } else {
      drivers = [];
    }
    return drivers.map((d) => ({ id: d.id, documentId: d.documentId, ...d })); // Assuming flat structure now
  } catch (error) {
    console.error('Error inside fetchDriversAPI:', error);
    throw error;
  }
};

const addDriverAPI = async (newDriverData) => {
  const response = await axios.post(API_ENDPOINT, { data: newDriverData });
  return response.data?.data;
};

const updateDriverAPI = async ({ documentId, data }) => {
  const response = await axios.put(`${API_ENDPOINT}/${documentId}`, {
    data: data,
  });
  return response.data?.data;
};

const deleteDriverAPI = async (driverDocumentId) => {
  deletingDocumentId.value = driverDocumentId;
  const response = await axios.delete(`${API_ENDPOINT}/${driverDocumentId}`);
  return response.data?.data;
};

const driversQuery = useQuery({
  queryKey: ['drivers'],
  queryFn: fetchDriversAPI,
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  onError: (error) => {
    console.error('Error fetching drivers query:', error);
    notyf.error(
      `خطا در دریافت لیست رانندگان: ${error.response?.data?.error?.message || error.message}`
    );
  },
});

const addMutation = useMutation({
  mutationFn: addDriverAPI,
  onSuccess: (newData) => {
    queryClient.invalidateQueries({ queryKey: ['drivers'] });
    queryClient.invalidateQueries({ queryKey: ['driversForSelect'] });
    const attributes = newData?.attributes ?? newData ?? {};
    notyf.success(
      `راننده ${attributes?.name ?? ''} ${attributes?.lastName ?? ''} با موفقیت اضافه شد.`
    );
    closeForm();
  },
  onError: (error) => {
    console.error('Error adding driver mutation:', error);
    const message =
      error.response?.data?.error?.message || error.message || 'خطای نامشخص';
    notyf.error(`خطا در افزودن راننده: ${message}`);
  },
});

const updateMutation = useMutation({
  mutationFn: updateDriverAPI,
  onSuccess: (updatedData, variables) => {
    queryClient.invalidateQueries({ queryKey: ['drivers'] });
    queryClient.invalidateQueries({ queryKey: ['driversForSelect'] });
    const attributes = updatedData?.attributes ?? updatedData ?? {};
    notyf.success(
      `راننده ${attributes?.name ?? ''} ${attributes?.lastName ?? ''} با موفقیت بروزرسانی شد.`
    );
    closeForm();
  },
  onError: (error, variables) => {
    console.error(
      `Error updating driver ${variables.documentId} mutation:`,
      error
    );
    const message =
      error.response?.data?.error?.message || error.message || 'خطای نامشخص';
    notyf.error(`خطا در بروزرسانی راننده: ${message}`);
  },
});

const deleteMutation = useMutation({
  mutationFn: deleteDriverAPI,
  onSuccess: (deletedData, driverDocumentId) => {
    queryClient.invalidateQueries({ queryKey: ['drivers'] });
    queryClient.invalidateQueries({ queryKey: ['driversForSelect'] });
    const attributes = deletedData?.attributes ?? deletedData ?? {};
    const name = attributes?.name;
    const lastName = attributes?.lastName;
    let message = '';
    if (name || lastName) {
      message =
        `راننده ${name || ''} ${lastName || ''} با موفقیت حذف شد.`.trim();
    } else {
      message = 'راننده با موفقیت حذف شد.';
    }
    notyf.success(message);
  },
  onError: (error, driverDocumentId) => {
    console.error(`Error deleting driver ${driverDocumentId} mutation:`, error);
    const message =
      error.response?.data?.error?.message || error.message || 'خطای نامشخص';
    notyf.error(`خطا در حذف راننده: ${message}`);
  },
  onSettled: () => {
    deletingDocumentId.value = null;
  },
});

function resetForm() {
  Object.assign(driverData, initialDriverData);
  editingDriverDocumentId.value = null;
}

function closeForm() {
  isFormOpen.value = false;
  resetForm();
}

function openAddForm() {
  resetForm();
  isFormOpen.value = true;
}

function openEditForm(driverItem) {
  if (!driverItem || !driverItem.documentId) {
    console.error(
      'Cannot edit invalid driver item (missing documentId):',
      driverItem
    );
    notyf.error('امکان ویرایش این آیتم وجود ندارد (شناسه سند نامعتبر).');
    return;
  }
  editingDriverDocumentId.value = driverItem.documentId;
  driverData.name = driverItem.name || '';
  driverData.lastName = driverItem.lastName || '';
  driverData.licenseExpireDate = driverItem.licenseExpireDate || '';
  driverData.phoneNumber = driverItem.phoneNumber || '';
  driverData.personalCode = driverItem.personalCode || '';
  isFormOpen.value = true;
}

function handleSubmit() {
  if (!driverData.lastName) {
    notyf.error('لطفاً نام خانوادگی را وارد کنید.');
    return;
  }
  if (!driverData.licenseExpireDate) {
    notyf.error('لطفاً تاریخ انقضا گواهینامه را وارد کنید.');
    return;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(driverData.licenseExpireDate)) {
    notyf.error('فرمت تاریخ انقضا گواهینامه نامعتبر است.');
    return;
  }

  const payload = {};
  for (const key in initialDriverData) {
    if (
      driverData[key] !== null &&
      driverData[key] !== undefined &&
      driverData[key] !== ''
    ) {
      payload[key] = driverData[key];
    }
  }
  if (payload.personalCode) payload.personalCode = Number(payload.personalCode);
  if (payload.phoneNumber) payload.phoneNumber = String(payload.phoneNumber); // Send as string

  if (editingDriverDocumentId.value !== null) {
    updateMutation.mutate({
      documentId: editingDriverDocumentId.value,
      data: payload,
    });
  } else {
    addMutation.mutate(payload);
  }
}

function confirmDelete(driverDocumentId, name, lastName) {
  if (!driverDocumentId) {
    console.error('Cannot delete: Invalid driverDocumentId provided.');
    notyf.error('امکان حذف این آیتم وجود ندارد (شناسه سند نامعتبر).');
    return;
  }
  const displayName =
    `${name || ''} ${lastName || ''}`.trim() ||
    `راننده با شناسه سند ${driverDocumentId}`;

  if (confirm(`آیا از حذف ${displayName} مطمئن هستید؟`)) {
    if (deleteMutation.isPending.value) return;
    deleteMutation.mutate(driverDocumentId);
  }
}

function formatDate(dateString) {
  if (!dateString) return '---';
  try {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const parsed = new Date(dateString);
      if (isNaN(parsed.getTime())) return dateString;
      return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short' }).format(
        parsed
      );
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short' }).format(
      date
    );
  } catch (e) {
    console.error('Error formatting date:', dateString, e);
    return dateString;
  }
}
</script>
