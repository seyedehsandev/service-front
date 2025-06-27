<template>
  <div dir="rtl" class="font-vazir">
    <div class="w-screen min-h-screen flex rounded-md bg-gray-50">
      <div class="w-full px-4 md:px-8">
        <header class="border-b border-gray-200 flex items-center gap-x-2">
          <router-link to="/dashboard">
            <img src="/favicon.png" alt="" class="w-10 h-10" />
          </router-link>
          <h1 class="text-2xl md:text-3xl py-4 px-2 font-bold text-gray-800">
            لیست خودروها
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
              اضافه کردن خودرو
            </button>
          </div>

          <div
            class="order-1 md:order-2 bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-100"
          >
            <span class="text-gray-600">
              تعداد کل خودروها:
              <span class="font-bold text-blue-600">{{
                carsQuery.data?.value?.length ?? 0
              }}</span>
            </span>
          </div>
        </main>

        <div v-if="carsQuery.isLoading.value" class="text-center py-10">
          در حال بارگذاری اطلاعات خودروها...
        </div>

        <div
          v-else-if="carsQuery.isError.value"
          class="text-center py-10 text-red-600"
        >
          خطا در دریافت اطلاعات: {{ carsQuery.error.value?.message }}
        </div>

        <div
          v-else-if="carsQuery.data.value && carsQuery.data.value.length > 0"
          class="rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-8 bg-white"
        >
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  v-for="(header, index) in [
                    'مدل',
                    'برند',
                    'پلاک',
                    'رنگ',
                    'نوع خودرو',
                    'سال ساخت',
                    'وضعیت',
                    'انقضا بیمه',
                    'انقضا معاینه فنی',
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
                v-for="item in carsQuery.data.value"
                :key="item.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.model }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.brand }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.plate }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.color }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ item.type }}</td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ item.year }}</td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.vehicleStatus }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ formatDate(item.expireInsurance) }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ formatDate(item.technicalInspectionExpireDate) }}
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
                      confirmDelete(item.documentId, item.model, item.brand)
                    "
                    :disabled="
                      deleteMutation.isPending.value &&
                      deletingCarDocId === item.documentId
                    "
                    class="bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 rounded-md text-white hover:shadow-md transition-all duration-200 text-sm flex items-center gap-1 disabled:opacity-50"
                  >
                    <svg
                      v-if="
                        !(
                          deleteMutation.isPending.value &&
                          deletingCarDocId === item.documentId
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
                editingCarDocId ? 'ویرایش مشخصات خودرو' : 'افزودن خودرو جدید'
              }}
            </h2>

            <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700"
                  >مدل <span class="text-red-500">*</span></label
                >
                <input
                  type="text"
                  v-model="vehicleData.model"
                  required
                  placeholder="مثال: ۲۰۶ تیپ ۵"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700"
                  >برند <span class="text-red-500">*</span></label
                >
                <input
                  type="text"
                  v-model="vehicleData.brand"
                  required
                  placeholder="مثال: ایران خودرو"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700"
                  >پلاک <span class="text-red-500">*</span></label
                >
                <input
                  type="text"
                  v-model="vehicleData.plate"
                  required
                  placeholder="مثال: ۱۲ الف ۳۴۵ ایران ۶۷"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700"
                  >رنگ <span class="text-red-500">*</span></label
                >
                <input
                  type="text"
                  v-model="vehicleData.color"
                  required
                  placeholder="مثال: سفید"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700"
                  >نوع خودرو <span class="text-red-500">*</span></label
                >
                <select
                  v-model="vehicleData.type"
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white h-[42px]"
                >
                  <option :value="null" disabled>انتخاب کنید...</option>
                  <option value="ون">ون</option>
                  <option value="تریلی">تریلی</option>
                  <option value="کامیونت">کامیونت</option>
                  <option value="سواری">سواری</option>
                  <option value="موتورسیکلت">موتورسیکلت</option>
                </select>
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700"
                  >سال تولید <span class="text-red-500">*</span></label
                >
                <input
                  type="number"
                  v-model.number="vehicleData.year"
                  required
                  min="1350"
                  max="1410"
                  placeholder="سال شمسی، مثال: ۱۴۰۲"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700"
                  >وضعیت خودرو <span class="text-red-500">*</span></label
                >
                <select
                  v-model="vehicleData.vehicleStatus"
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white h-[42px]"
                >
                  <option :value="null" disabled>انتخاب کنید...</option>
                  <option value="فعال">فعال</option>
                  <option value="غیر فعال">غیر فعال</option>
                  <option value="در دست تعمیر">در دست تعمیر</option>
                  <option value="اسقاط">اسقاط</option>
                  <option value="در سفر">در سفر</option>
                </select>
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700"
                  >انقضاء بیمه <span class="text-red-500">*</span></label
                >
                <DatePicker
                  v-model="vehicleData.expireInsurance"
                  format="YYYY-MM-DD"
                  display-format="jYYYY/jMM/jDD"
                  required
                  placeholder="تاریخ انقضا بیمه"
                  input-class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none h-[42px]"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700"
                  >انقضاء معاینه فنی <span class="text-red-500">*</span></label
                >
                <DatePicker
                  v-model="vehicleData.technicalInspectionExpireDate"
                  format="YYYY-MM-DD"
                  display-format="jYYYY/jMM/jDD"
                  required
                  placeholder="تاریخ انقضا معاینه فنی"
                  input-class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none h-[42px]"
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
                {{ editingCarDocId ? 'بروزرسانی اطلاعات' : 'ثبت اطلاعات' }}
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
const VEHICLES_API_ENDPOINT = `${STRAPI_API_URL}/api/vehicles`;

const queryClient = useQueryClient();
const notyf = new Notyf({
  duration: 4000,
  position: { x: 'left', y: 'bottom' },
  dismissible: true,
});

const isFormOpen = ref(false);
const editingCarDocId = ref(null);
const deletingCarDocId = ref(null);

const initialVehicleData = {
  model: '',
  brand: '',
  plate: '',
  color: '',
  type: null,
  year: null,
  vehicleStatus: null,
  expireInsurance: '',
  technicalInspectionExpireDate: '',
};
const vehicleData = reactive({ ...initialVehicleData });

const fetchVehiclesAPI = async () => {
  try {
    const response = await axios.get(VEHICLES_API_ENDPOINT);
    console.log('پاسخ خام از API:', JSON.stringify(response.data, null, 2));

    let vehicles = [];
    if (Array.isArray(response.data?.data)) {
      vehicles = response.data.data;
    } else if (Array.isArray(response.data)) {
      vehicles = response.data;
    } else {
      console.warn('ساختار پاسخ API غیرمنتظره است:', response.data);
      vehicles = [];
    }

    console.log(
      'آرایه نهایی خودروها برای استفاده:',
      JSON.stringify(vehicles, null, 2)
    );
    return vehicles;
  } catch (error) {
    console.error('خطا در داخل fetchVehiclesAPI:', error);
    throw error;
  }
};

const addVehicleAPI = async (newVehiclePayload) => {
  const response = await axios.post(VEHICLES_API_ENDPOINT, {
    data: newVehiclePayload,
  });
  const addedData = response.data?.data;
  return addedData
    ? { id: addedData.id, ...addedData.attributes }
    : response.data;
};

const updateVehicleAPI = async ({ docId, data }) => {
  const response = await axios.put(`${VEHICLES_API_ENDPOINT}/${docId}`, {
    data: data,
  });
  const updatedData = response.data?.data;
  return updatedData
    ? { id: updatedData.id, ...updatedData.attributes }
    : response.data;
};

const deleteVehicleAPI = async (docId) => {
  deletingCarDocId.value = docId; // Use the correct ref name
  const response = await axios.delete(`${VEHICLES_API_ENDPOINT}/${docId}`);
  const deletedData = response.data?.data;
  return deletedData
    ? { id: deletedData.id, ...deletedData.attributes }
    : response.data;
};

const carsQuery = useQuery({
  queryKey: ['vehicles'],
  queryFn: fetchVehiclesAPI,
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  onError: (error) => {
    console.error('Error fetching vehicles query:', error);
    notyf.error(
      `خطا در دریافت لیست خودروها: ${error.response?.data?.error?.message || error.message}`
    );
  },
});

watch(
  () => carsQuery.data.value,
  (newData) => {
    if (newData) {
      console.log(
        'ساختار داده دریافتی برای جدول:',
        JSON.stringify(newData, null, 2)
      );
      if (newData.length > 0) {
        console.log('ساختار اولین آیتم:', newData[0]);
      }
    } else {
      console.log('داده‌های جدول هنوز دریافت نشده یا خالی است.');
    }
  },
  { immediate: true, deep: true }
);

const addMutation = useMutation({
  mutationFn: addVehicleAPI,
  onSuccess: (newData) => {
    queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    queryClient.invalidateQueries({ queryKey: ['vehiclesForSelect'] });
    const brand = newData?.brand ?? newData?.attributes?.brand ?? '';
    const model = newData?.model ?? newData?.attributes?.model ?? '';
    notyf.success(`خودرو ${brand} ${model} با موفقیت اضافه شد.`);
    closeForm();
  },
  onError: (error) => {
    console.error('Error adding vehicle mutation:', error);
    const message =
      error.response?.data?.error?.message || error.message || 'خطای نامشخص';
    notyf.error(`خطا در افزودن خودرو: ${message}`);
  },
});

const updateMutation = useMutation({
  mutationFn: updateVehicleAPI,
  onSuccess: (updatedData, variables) => {
    queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    queryClient.invalidateQueries({ queryKey: ['vehiclesForSelect'] });
    const brand = updatedData?.brand ?? updatedData?.attributes?.brand ?? '';
    const model = updatedData?.model ?? updatedData?.attributes?.model ?? '';
    notyf.success(`خودرو ${brand} ${model} با موفقیت بروزرسانی شد.`);
    closeForm();
  },
  onError: (error, variables) => {
    // variables.docId holds documentId
    console.error(`Error updating vehicle ${variables.docId} mutation:`, error);
    const message =
      error.response?.data?.error?.message || error.message || 'خطای نامشخص';
    notyf.error(`خطا در بروزرسانی خودرو: ${message}`);
  },
});

const deleteMutation = useMutation({
  mutationFn: deleteVehicleAPI,
  onSuccess: (deletedData, docId) => {
    queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    queryClient.invalidateQueries({ queryKey: ['vehiclesForSelect'] });
    const model = deletedData?.model ?? deletedData?.attributes?.model;
    const brand = deletedData?.brand ?? deletedData?.attributes?.brand;
    let message = '';
    if (brand || model) {
      message = `خودرو ${brand || ''} ${model || ''} با موفقیت حذف شد.`.trim();
    } else {
      message = 'خودرو با موفقیت حذف شد.';
    }
    notyf.success(message);
  },
  onError: (error, docId) => {
    console.error(`Error deleting vehicle ${docId} mutation:`, error);
    const message =
      error.response?.data?.error?.message || error.message || 'خطای نامشخص';
    notyf.error(`خطا در حذف خودرو: ${message}`);
  },
  onSettled: () => {
    deletingCarDocId.value = null; // Use the correct ref name
  },
});

function resetForm() {
  Object.assign(vehicleData, initialVehicleData);
  editingCarDocId.value = null; // Use the correct ref name
}

function closeForm() {
  isFormOpen.value = false;
  resetForm();
}

function openAddForm() {
  resetForm();
  isFormOpen.value = true;
}

function openEditForm(vehicleItem) {
  if (!vehicleItem || !vehicleItem.documentId) {
    // Check for documentId
    console.error(
      'Cannot edit invalid vehicle item (missing documentId):',
      vehicleItem
    );
    notyf.error('امکان ویرایش این آیتم وجود ندارد (شناسه سند نامعتبر).');
    return;
  }
  editingCarDocId.value = vehicleItem.documentId; // Store documentId
  vehicleData.model = vehicleItem.model || '';
  vehicleData.brand = vehicleItem.brand || '';
  vehicleData.plate = vehicleItem.plate || '';
  vehicleData.color = vehicleItem.color || '';
  vehicleData.type = vehicleItem.type || null;
  vehicleData.year = vehicleItem.year || null;
  vehicleData.vehicleStatus = vehicleItem.vehicleStatus || null;
  vehicleData.expireInsurance = vehicleItem.expireInsurance || '';
  vehicleData.technicalInspectionExpireDate =
    vehicleItem.technicalInspectionExpireDate || '';

  isFormOpen.value = true;
}

function handleSubmit() {
  if (
    !vehicleData.model ||
    !vehicleData.brand ||
    !vehicleData.plate ||
    !vehicleData.color ||
    vehicleData.type === null ||
    vehicleData.year === null ||
    vehicleData.vehicleStatus === null ||
    !vehicleData.expireInsurance ||
    !vehicleData.technicalInspectionExpireDate
  ) {
    notyf.error('لطفاً تمام فیلدهای فرم را تکمیل کنید.');
    return;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(vehicleData.expireInsurance)) {
    notyf.error('فرمت تاریخ انقضا بیمه نامعتبر است.');
    return;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(vehicleData.technicalInspectionExpireDate)) {
    notyf.error('فرمت تاریخ انقضا معاینه فنی نامعتبر است.');
    return;
  }
  if (vehicleData.year < 1350 || vehicleData.year > 1410) {
    notyf.error('سال تولید باید بین ۱۳۵۰ تا ۱۴۱۰ باشد.');
    return;
  }

  const payload = {
    model: vehicleData.model,
    brand: vehicleData.brand,
    plate: vehicleData.plate,
    color: vehicleData.color,
    type: vehicleData.type,
    year: parseInt(vehicleData.year, 10),
    vehicleStatus: vehicleData.vehicleStatus,
    expireInsurance: vehicleData.expireInsurance,
    technicalInspectionExpireDate: vehicleData.technicalInspectionExpireDate,
  };

  console.log('Submitting payload:', JSON.stringify(payload, null, 2));

  if (editingCarDocId.value !== null) {
    // Use editingCarDocId
    updateMutation.mutate({ docId: editingCarDocId.value, data: payload }); // Pass docId
  } else {
    addMutation.mutate(payload);
  }
}

function confirmDelete(docId, model, brand) {
  if (!docId) {
    console.error('Cannot delete: Invalid documentId provided.');
    notyf.error('امکان حذف این آیتم وجود ندارد (شناسه سند نامعتبر).');
    return;
  }
  const displayName =
    `${brand || ''} ${model || ''}`.trim() || `خودرو با شناسه ${docId}`;

  if (confirm(`آیا از حذف ${displayName} مطمئن هستید؟`)) {
    if (deleteMutation.isPending.value) return;
    deleteMutation.mutate(docId);
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
