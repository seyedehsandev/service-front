<template>
  <div dir="rtl" class="font-vazir">
    <div class="w-screen min-h-screen flex rounded-md bg-gray-50">
      <div class="w-full px-4 md:px-8">
        <header class="border-b border-gray-200">
          <h1 class="text-2xl md:text-3xl py-4 px-2 font-bold text-gray-800">
            لیست سفرها
          </h1>
        </header>

        <main
          class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between px-2 py-6"
        >
          <div class="order-2 md:order-1">
            <button
              @click="openAddForm"
              class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white font-medium flex items-center gap-2"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              ایجاد سفر جدید
            </button>
          </div>

          <div
            class="order-1 md:order-2 bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-100"
          >
            <span class="text-gray-600">
              تعداد کل سفرها:
              <span class="font-bold text-blue-600">{{
                tripsQuery.data?.value?.meta?.pagination?.total ??
                tripsQuery.data?.value?.data?.length ??
                0
              }}</span>
            </span>
          </div>
        </main>

        <div v-if="tripsQuery.isLoading.value" class="text-center py-10">
          در حال بارگذاری اطلاعات سفرها...
        </div>
        <div
          v-else-if="tripsQuery.isError.value"
          class="text-center py-10 text-red-600"
        >
          خطا در دریافت اطلاعات: {{ tripsQuery.error.value?.message }}
        </div>

        <div
          v-else-if="
            tripsQuery.data.value?.data && tripsQuery.data.value.data.length > 0
          "
          class="rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-8 bg-white"
        >
          <div class="overflow-x-auto">
            <table class="w-full min-w-[1000px]">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    v-for="(header, index) in tableHeaders"
                    :key="index"
                    class="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-if="tripsQuery.data.value.data.length === 0">
                  <td
                    :colspan="tableHeaders.length"
                    class="text-center py-6 text-gray-500"
                  >
                    سفری یافت نشد.
                  </td>
                </tr>
                <tr
                  v-for="item in tripsQuery.data.value.data"
                  :key="item.documentId"
                  @click="showDetails(item)"
                  class="hover:bg-blue-50 transition-colors duration-150 text-sm cursor-pointer"
                >
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{ formatDate(item.date) }}
                  </td>
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{ item.driver?.name ?? '' }}
                    {{
                      item.driver?.lastName ??
                      `(ID: ${item.driver?.documentId})`
                    }}
                  </td>
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{ item.vehicle?.plate ?? '؟' }}
                    <span class="text-xs text-gray-500"
                      >({{ item.vehicle?.brand ?? '' }}
                      {{ item.vehicle?.model ?? '' }})</span
                    >
                  </td>
                  <td class="px-4 py-3 text-gray-700">{{ item.origin }}</td>
                  <td class="px-4 py-3 text-gray-700">
                    {{ item.destination }}
                  </td>
                  <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {{
                      calculateDistance(item.startOdometer, item.endOdometer)
                    }}
                  </td>
                  <td
                    class="px-4 py-3 text-gray-700 whitespace-nowrap font-medium"
                  >
                    {{ (item.totalCost ?? 0).toLocaleString() }} T
                  </td>
                  <td class="px-4 py-3 text-center whitespace-nowrap">
                    <button
                      @click.stop="openEditForm(item)"
                      class="text-blue-500 hover:text-blue-700 p-1 mx-1 transition-colors"
                      title="ویرایش سفر"
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
                      @click.stop="
                        confirmDelete(
                          item.documentId,
                          item.origin,
                          item.destination
                        )
                      "
                      :disabled="
                        deleteMutation.isPending.value &&
                        deletingTripId === item.documentId
                      "
                      class="text-red-500 hover:text-red-700 p-1 mx-1 transition-colors disabled:opacity-50"
                      title="حذف سفر"
                    >
                      <svg
                        v-if="
                          !(
                            deleteMutation.isPending.value &&
                            deletingTripId === item.documentId
                          )
                        "
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
                      <span v-else>...</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="text-center py-10 text-gray-500">
          سفری ثبت نشده است.
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
            @click="closeForm"
          ></div>
        </transition>
        <transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <form
            v-if="isFormOpen"
            class="fixed inset-0 z-50 flex flex-col overflow-hidden bg-gray-50 shadow-2xl md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-h-[90vh] md:rounded-2xl md:max-w-4xl w-full"
            @submit.prevent="handleSubmit"
          >
            <div
              class="border-b border-gray-200 p-4 flex items-center justify-between bg-white shadow-sm flex-shrink-0 md:rounded-t-2xl"
            >
              <h2 class="text-xl font-bold text-gray-800">
                {{ editingTripId ? 'ویرایش سفر' : 'ایجاد سفر جدید' }}
              </h2>
              <button
                @click="closeForm"
                type="button"
                class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
                title="بستن فرم"
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

            <div class="flex-1 overflow-y-auto p-6 md:p-8">
              <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5"
              >
                <div class="space-y-5">
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >تاریخ سفر <span class="text-red-500">*</span></label
                    >
                    <DatePicker
                      v-model="tripData.date"
                      format="YYYY-MM-DD"
                      display-format="jYYYY/jMM/jDD"
                      required
                      input-class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white h-[42px]"
                      placeholder="انتخاب تاریخ"
                    />
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >راننده</label
                    >
                    <div class="relative">
                      <select
                        v-model="tripData.driver"
                        class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none pr-10 bg-white h-[42px]"
                        :disabled="driversQuery.isLoading.value"
                      >
                        <option :value="null">
                          --
                          {{
                            driversQuery.isLoading.value
                              ? 'درحال بارگیری...'
                              : 'انتخاب راننده (اختیاری)'
                          }}
                          --
                        </option>
                        <option
                          v-for="driver in driversQuery.data?.value?.data"
                          :key="driver.documentId"
                          :value="driver.documentId"
                        >
                          {{ driver.name }} {{ driver.lastName }}
                        </option>
                      </select>
                      <div
                        class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      >
                        <svg
                          class="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <span
                      v-if="driversQuery.isError.value"
                      class="text-xs text-red-500 mt-1"
                      >خطا در بارگیری رانندگان</span
                    >
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >خودرو</label
                    >
                    <div class="relative">
                      <select
                        v-model="tripData.vehicle"
                        class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none pr-10 bg-white h-[42px]"
                        :disabled="vehiclesQuery.isLoading.value"
                      >
                        <option :value="null">
                          --
                          {{
                            vehiclesQuery.isLoading.value
                              ? 'درحال بارگیری...'
                              : 'انتخاب خودرو (اختیاری)'
                          }}
                          --
                        </option>
                        <option
                          v-for="vehicle in vehiclesQuery.data?.value?.data"
                          :key="vehicle.documentId"
                          :value="vehicle.documentId"
                        >
                          {{ vehicle.brand }} {{ vehicle.model }} ({{
                            vehicle.plate
                          }})
                        </option>
                      </select>
                      <div
                        class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      >
                        <svg
                          class="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <span
                      v-if="vehiclesQuery.isError.value"
                      class="text-xs text-red-500 mt-1"
                      >خطا در بارگیری خودروها</span
                    >
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >مبدا <span class="text-red-500">*</span></label
                    >
                    <input
                      type="text"
                      v-model.trim="tripData.origin"
                      required
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >مقصد <span class="text-red-500">*</span></label
                    >
                    <input
                      type="text"
                      v-model.trim="tripData.destination"
                      required
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div
                  class="space-y-5 border-t md:border-t-0 md:border-r border-gray-200 md:pr-6 pt-5 md:pt-0"
                >
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >کیلومتر شمار شروع
                      <span class="text-red-500">*</span></label
                    >
                    <input
                      type="number"
                      min="0"
                      v-model.number="tripData.startOdometer"
                      required
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >کیلومتر شمار پایان
                      <span class="text-red-500">*</span></label
                    >
                    <input
                      type="number"
                      :min="tripData.startOdometer || 0"
                      v-model.number="tripData.endOdometer"
                      required
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <h3 class="text-md font-semibold text-gray-600 pt-3 mb-3">
                    سوخت اضافه شده (اختیاری)
                  </h3>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >نوع سوخت</label
                    >
                    <div class="relative">
                      <select
                        v-model="tripData.fuelType"
                        class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none pr-10 bg-white h-[42px]"
                      >
                        <option :value="null">-- انتخاب --</option>
                        <option value="بنزین">بنزین</option>
                        <option value="دیزل">دیزل</option>
                      </select>
                      <div
                        class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      >
                        <svg
                          class="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >نرخ سوخت</label
                    >
                    <div class="relative">
                      <select
                        v-model="tripData.fuelRate"
                        class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none pr-10 bg-white h-[42px]"
                      >
                        <option :value="null">-- انتخاب --</option>
                        <option value="دولتی">دولتی</option>
                        <option value="آزاد">آزاد</option>
                      </select>
                      <div
                        class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      >
                        <svg
                          class="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >مقدار سوخت اضافه شده (لیتر)</label
                    >
                    <input
                      type="number"
                      min="0"
                      v-model.number="tripData.fuelLitersAdded"
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >هزینه سوخت اضافه شده (تومان)</label
                    >
                    <input
                      type="number"
                      min="0"
                      v-model.number="tripData.fuelCost"
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div
                  class="space-y-5 border-t lg:border-t-0 lg:border-r border-gray-200 lg:pr-6 pt-5 lg:pt-0"
                >
                  <h3 class="text-md font-semibold text-gray-600 mb-3">
                    سایر هزینه‌ها (تومان - اختیاری)
                  </h3>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >هزینه غذا</label
                    >
                    <input
                      type="number"
                      min="0"
                      v-model.number="tripData.mealPrice"
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >هزینه پارکینگ</label
                    >
                    <input
                      type="number"
                      min="0"
                      v-model.number="tripData.parkingCost"
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >هزینه عوارض</label
                    >
                    <input
                      type="number"
                      min="0"
                      v-model.number="tripData.tollCost"
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >هزینه جریمه</label
                    >
                    <input
                      type="number"
                      min="0"
                      v-model.number="tripData.fineCost"
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >سایر هزینه‌ها</label
                    >
                    <input
                      type="number"
                      min="0"
                      v-model.number="tripData.otherCosts"
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700"
                      >توضیحات</label
                    >
                    <textarea
                      v-model.trim="tripData.description"
                      rows="4"
                      class="w-full px-4 py-2.5 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="border-t border-gray-200 p-4 bg-gray-100 mt-auto flex-shrink-0 md:rounded-b-2xl"
            >
              <div class="max-w-5xl mx-auto flex justify-end gap-4">
                <button
                  @click="closeForm"
                  type="button"
                  class="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  :disabled="
                    addMutation.isPending.value ||
                    updateMutation.isPending.value
                  "
                  class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-8 rounded-lg transition-colors duration-200 shadow hover:shadow-md disabled:opacity-50"
                >
                  <span
                    v-if="
                      addMutation.isPending.value ||
                      updateMutation.isPending.value
                    "
                    >در حال پردازش...</span
                  >
                  <span v-else>{{
                    editingTripId ? 'بروزرسانی سفر' : 'ثبت سفر'
                  }}</span>
                </button>
              </div>
              <p
                v-if="addMutation.isError.value || updateMutation.isError.value"
                class="text-red-500 text-sm mt-3 text-center"
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
            </div>
          </form>
        </transition>

        <transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="selectedTripForDetails"
            class="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col"
            >
              <div
                class="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0"
              >
                <h3 class="text-lg font-semibold text-gray-800">
                  جزئیات سفر (ID: {{ selectedTripForDetails.documentId }})
                </h3>
                <button
                  @click="selectedTripForDetails = null"
                  class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
                  title="بستن"
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
              <div class="p-6 overflow-y-auto flex-1"></div>
              <div
                class="p-4 border-t border-gray-200 bg-gray-50 flex justify-end flex-shrink-0"
              >
                <button
                  @click="selectedTripForDetails = null"
                  class="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </transition>
        <transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-if="selectedTripForDetails"
            class="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col"
            >
              <div
                class="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0"
              >
                <h3 class="text-lg font-semibold text-gray-800">
                  جزئیات سفر (ID: {{ selectedTripForDetails.documentId }})
                </h3>
                <button
                  @click="selectedTripForDetails = null"
                  class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
                  title="بستن"
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
              <div class="p-6 overflow-y-auto flex-1">
                <dl
                  class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm"
                >
                  <div class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">تاریخ:</dt>
                    <dd class="text-gray-900 mt-1">
                      {{ formatDate(selectedTripForDetails.date) }}
                    </dd>
                  </div>

                  <div class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">راننده:</dt>
                    <dd class="text-gray-900 mt-1">
                      {{ selectedTripForDetails.driver?.name ?? '' }}
                      {{
                        selectedTripForDetails.driver?.lastName ??
                        '(راننده نامشخص)'
                      }}
                    </dd>
                  </div>

                  <div class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">خودرو:</dt>
                    <dd class="text-gray-900 mt-1">
                      {{ selectedTripForDetails.vehicle?.brand ?? '' }}
                      {{ selectedTripForDetails.vehicle?.model ?? '' }}
                      <span
                        v-if="selectedTripForDetails.vehicle"
                        class="text-gray-400"
                      >
                        ({{
                          selectedTripForDetails.vehicle.plate ?? 'پلاک نامشخص'
                        }})
                      </span>
                    </dd>
                  </div>

                  <div class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">مبدا:</dt>
                    <dd class="text-gray-900 mt-1">
                      {{ selectedTripForDetails.origin }}
                    </dd>
                  </div>

                  <div class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">مقصد:</dt>
                    <dd class="text-gray-900 mt-1">
                      {{ selectedTripForDetails.destination }}
                    </dd>
                  </div>

                  <div class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">
                      کیلومتر شمار شروع:
                    </dt>
                    <dd class="text-gray-900 mt-1">
                      {{
                        selectedTripForDetails.startOdometer?.toLocaleString() ??
                        '-'
                      }}
                    </dd>
                  </div>

                  <div class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">
                      کیلومتر شمار پایان:
                    </dt>
                    <dd class="text-gray-900 mt-1">
                      {{
                        selectedTripForDetails.endOdometer?.toLocaleString() ??
                        '-'
                      }}
                    </dd>
                  </div>

                  <div class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">مسافت طی شده:</dt>
                    <dd class="text-gray-900 mt-1">
                      {{
                        calculateDistance(
                          selectedTripForDetails.startOdometer,
                          selectedTripForDetails.endOdometer
                        )
                      }}
                    </dd>
                  </div>

                  <div class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">
                      نوع سوخت اضافه شده:
                    </dt>
                    <dd class="text-gray-900 mt-1">
                      {{ selectedTripForDetails.fuelType || '-' }}
                    </dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">
                      نرخ سوخت اضافه شده:
                    </dt>
                    <dd class="text-gray-900 mt-1">
                      {{ selectedTripForDetails.fuelRate || '-' }}
                    </dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">
                      مقدار سوخت اضافه شده:
                    </dt>
                    <dd class="text-gray-900 mt-1">
                      {{
                        selectedTripForDetails.fuelLitersAdded?.toLocaleString() ??
                        '۰'
                      }}
                      لیتر
                    </dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">
                      هزینه سوخت اضافه شده:
                    </dt>
                    <dd class="text-gray-900 mt-1">
                      {{
                        selectedTripForDetails.fuelCost?.toLocaleString() ?? '۰'
                      }}
                      تومان
                    </dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">هزینه غذا:</dt>
                    <dd class="text-gray-900 mt-1">
                      {{
                        selectedTripForDetails.mealPrice?.toLocaleString() ??
                        '۰'
                      }}
                      تومان
                    </dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">هزینه پارکینگ:</dt>
                    <dd class="text-gray-900 mt-1">
                      {{
                        selectedTripForDetails.parkingCost?.toLocaleString() ??
                        '۰'
                      }}
                      تومان
                    </dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">هزینه عوارض:</dt>
                    <dd class="text-gray-900 mt-1">
                      {{
                        selectedTripForDetails.tollCost?.toLocaleString() ?? '۰'
                      }}
                      تومان
                    </dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">هزینه جریمه:</dt>
                    <dd class="text-gray-900 mt-1">
                      {{
                        selectedTripForDetails.fineCost?.toLocaleString() ?? '۰'
                      }}
                      تومان
                    </dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">سایر هزینه‌ها:</dt>
                    <dd class="text-gray-900 mt-1">
                      {{
                        selectedTripForDetails.otherCosts?.toLocaleString() ??
                        '۰'
                      }}
                      تومان
                    </dd>
                  </div>
                  <div class="sm:col-span-2">
                    <dt class="font-medium text-gray-500">
                      هزینه کل (از بک‌اند):
                    </dt>
                    <dd class="text-gray-900 mt-1 font-semibold">
                      {{
                        selectedTripForDetails.totalCost?.toLocaleString() ??
                        '۰'
                      }}
                      تومان
                    </dd>
                  </div>
                  <div class="sm:col-span-2">
                    <dt class="font-medium text-gray-500">توضیحات:</dt>
                    <dd class="text-gray-900 mt-1 whitespace-pre-wrap">
                      {{ selectedTripForDetails.description || '-' }}
                    </dd>
                  </div>
                </dl>
              </div>
              <div
                class="p-4 border-t border-gray-200 bg-gray-50 flex justify-end flex-shrink-0"
              >
                <button
                  @click="selectedTripForDetails = null"
                  class="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </transition>
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
const TRIPS_API_ENDPOINT = `${STRAPI_API_URL}/api/trips`;
const DRIVERS_API_ENDPOINT = `${STRAPI_API_URL}/api/drivers`;
const VEHICLES_API_ENDPOINT = `${STRAPI_API_URL}/api/vehicles`;

const queryClient = useQueryClient();
const notyf = new Notyf({
  duration: 4000,
  position: { x: 'left', y: 'bottom' },
  dismissible: true,
});

const isFormOpen = ref(false);
const editingTripId = ref(null);
const deletingTripId = ref(null);
const selectedTripForDetails = ref(null);

const initialTripData = {
  date: null,
  driver: null,
  vehicle: null,
  origin: '',
  destination: '',
  startOdometer: null,
  endOdometer: null,
  fuelType: null,
  fuelRate: null,
  fuelLitersAdded: null,
  fuelCost: null,
  mealPrice: null,
  parkingCost: null,
  tollCost: null,
  fineCost: null,
  otherCosts: null,
  description: '',
};
const tripData = reactive({ ...initialTripData });

const tableHeaders = [
  'تاریخ',
  'راننده',
  'خودرو',
  'مبدا',
  'مقصد',
  'مسافت (KM)',
  'هزینه کل (T)',
  'عملیات',
];

const fetchTripsAPI = async () => {
  try {
    const params = {
      populate: ['driver', 'vehicle'],
      sort: ['date:desc'],
    };
    const response = await axios.get(TRIPS_API_ENDPOINT, { params });
    console.log('Trips Raw Response:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error('Error fetching trips:', error);
    throw error;
  }
};

const fetchDriversForSelectAPI = async () => {
  try {
    const params = {
      fields: ['name', 'lastName'],
      pagination: { limit: 1000 },
    };
    const response = await axios.get(DRIVERS_API_ENDPOINT, { params });
    console.log(
      'Drivers for select Raw Response:',
      JSON.stringify(response.data, null, 2)
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching drivers for select:', error);
    throw error;
  }
};

const fetchVehiclesForSelectAPI = async () => {
  try {
    const params = {
      fields: ['plate', 'brand', 'model'],
      pagination: { limit: 1000 },
    };
    const response = await axios.get(VEHICLES_API_ENDPOINT, { params });
    console.log(
      'Vehicles for select Raw Response:',
      JSON.stringify(response.data, null, 2)
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicles for select:', error);
    throw error;
  }
};

const addTripAPI = async (newTripPayload) => {
  const response = await axios.post(TRIPS_API_ENDPOINT, {
    data: newTripPayload,
  });
  return response.data?.data;
};

const updateTripAPI = async ({ tripId, data }) => {
  const response = await axios.put(`${TRIPS_API_ENDPOINT}/${tripId}`, {
    data: data,
  });
  return response.data?.data; // Expect { id: ..., field1: ..., ... } (flat)
};

const deleteTripAPI = async (tripId) => {
  deletingTripId.value = tripId;
  const response = await axios.delete(`${TRIPS_API_ENDPOINT}/${tripId}`);
  return response.data?.data;
};

const tripsQuery = useQuery({
  queryKey: ['trips'],
  queryFn: fetchTripsAPI,
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  onError: (error) => {
    notyf.error(
      `خطا در دریافت لیست سفرها: ${error.response?.data?.error?.message || error.message}`
    );
  },
});

const driversQuery = useQuery({
  queryKey: ['driversForSelect'],
  queryFn: fetchDriversForSelectAPI,
  staleTime: Infinity,
  refetchOnWindowFocus: false,
});

const vehiclesQuery = useQuery({
  queryKey: ['vehiclesForSelect'],
  queryFn: fetchVehiclesForSelectAPI,
  staleTime: Infinity,
  refetchOnWindowFocus: false,
});

const addMutation = useMutation({
  mutationFn: addTripAPI,
  onSuccess: (newDataResponse) => {
    queryClient.invalidateQueries({ queryKey: ['trips'] });
    notyf.success(`سفر جدید با موفقیت ثبت شد.`);
    closeForm();
  },
  onError: (error) => {
    console.error('Error adding trip:', error);
    notyf.error(
      `خطا در ثبت سفر: ${error.response?.data?.error?.message || error.message}`
    );
  },
});

const updateMutation = useMutation({
  mutationFn: updateTripAPI,
  onSuccess: (updatedDataResponse, variables) => {
    queryClient.invalidateQueries({ queryKey: ['trips'] });
    notyf.success(`سفر با شناسه ${variables.tripId} با موفقیت بروزرسانی شد.`);
    closeForm();
  },
  onError: (error, variables) => {
    console.error(`Error updating trip ${variables.tripId}:`, error);
    notyf.error(
      `خطا در بروزرسانی سفر: ${error.response?.data?.error?.message || error.message}`
    );
  },
});

const deleteMutation = useMutation({
  mutationFn: deleteTripAPI,
  onSuccess: (deletedDataResponse, tripId) => {
    queryClient.invalidateQueries({ queryKey: ['trips'] });
    const deletedItem = deletedDataResponse ?? {};
    const origin = deletedItem.origin || '';
    const dest = deletedItem.destination || '';
    let message = '';
    if (origin && dest) {
      message = `سفر از ${origin} به ${dest} با موفقیت حذف شد.`;
    } else {
      message = `سفر با شناسه ${tripId} با موفقیت حذف شد.`;
    }
    notyf.success(message);
  },
  onError: (error, tripId) => {
    console.error(`Error deleting trip ${tripId}:`, error);
    notyf.error(
      `خطا در حذف سفر: ${error.response?.data?.error?.message || error.message}`
    );
  },
  onSettled: () => {
    deletingTripId.value = null;
  },
});

function resetForm() {
  Object.assign(tripData, initialTripData);
  editingTripId.value = null;
}

function closeForm() {
  isFormOpen.value = false;
  selectedTripForDetails.value = null;
  resetForm();
}

function openAddForm() {
  resetForm();
  tripData.date = new Date().toISOString().split('T')[0];
  isFormOpen.value = true;
}

function openEditForm(tripItem) {
  if (!tripItem || !tripItem.documentId) {
    notyf.error('امکان ویرایش این آیتم وجود ندارد (شناسه نامعتبر).');
    return;
  }
  editingTripId.value = tripItem.documentId;

  tripData.driver = tripItem.driver?.documentId || null;
  tripData.vehicle = tripItem.vehicle?.documentId || null;

  tripData.date = tripItem.date || null;
  tripData.origin = tripItem.origin || '';
  tripData.destination = tripItem.destination || '';
  tripData.startOdometer = tripItem.startOdometer ?? null;
  tripData.endOdometer = tripItem.endOdometer ?? null;
  tripData.fuelType = tripItem.fuelType || null;
  tripData.fuelRate = tripItem.fuelRate || null;
  tripData.fuelLitersAdded = tripItem.fuelLitersAdded ?? null;
  tripData.fuelCost = tripItem.fuelCost ?? null;
  tripData.mealPrice = tripItem.mealPrice ?? null;
  tripData.parkingCost = tripItem.parkingCost ?? null;
  tripData.tollCost = tripItem.tollCost ?? null;
  tripData.fineCost = tripItem.fineCost ?? null;
  tripData.otherCosts = tripItem.otherCosts ?? null;
  tripData.description = tripItem.description || '';

  isFormOpen.value = true;
}

function handleSubmit() {
  if (
    !tripData.date ||
    !tripData.origin ||
    !tripData.destination ||
    tripData.startOdometer === null ||
    tripData.endOdometer === null
  ) {
    notyf.error(
      'لطفاً فیلدهای ستاره‌دار (تاریخ، مبدا، مقصد، کیلومترشمارها) را تکمیل کنید.'
    );
    return;
  }
  if (
    tripData.startOdometer !== null &&
    tripData.endOdometer !== null &&
    tripData.endOdometer < tripData.startOdometer
  ) {
    notyf.error('کیلومتر شمار پایان نمی‌تواند کمتر از کیلومتر شمار شروع باشد.');
    return;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tripData.date)) {
    notyf.error('فرمت تاریخ نامعتبر است.');
    return;
  }

  const payload = {
    date: tripData.date,
    driver: tripData.driver === null ? undefined : tripData.driver,
    vehicle: tripData.vehicle === null ? undefined : tripData.vehicle,
    origin: tripData.origin,
    destination: tripData.destination,
    startOdometer: tripData.startOdometer,
    endOdometer: tripData.endOdometer,
    fuelType: tripData.fuelType === null ? undefined : tripData.fuelType,
    fuelRate: tripData.fuelRate === null ? undefined : tripData.fuelRate,
    fuelLitersAdded:
      tripData.fuelLitersAdded === null ? undefined : tripData.fuelLitersAdded,
    fuelCost: tripData.fuelCost === null ? undefined : tripData.fuelCost,
    mealPrice: tripData.mealPrice === null ? undefined : tripData.mealPrice,
    parkingCost:
      tripData.parkingCost === null ? undefined : tripData.parkingCost,
    tollCost: tripData.tollCost === null ? undefined : tripData.tollCost,
    fineCost: tripData.fineCost === null ? undefined : tripData.fineCost,
    otherCosts: tripData.otherCosts === null ? undefined : tripData.otherCosts,
    description: tripData.description || undefined,
  };
  Object.keys(payload).forEach(
    (key) => payload[key] === undefined && delete payload[key]
  );

  if (editingTripId.value !== null) {
    updateMutation.mutate({ tripId: editingTripId.value, data: payload });
  } else {
    addMutation.mutate(payload);
  }
}

function confirmDelete(tripId, origin, dest) {
  if (!tripId) {
    notyf.error('امکان حذف این آیتم وجود ندارد (شناسه نامعتبر).');
    return;
  }
  const displayName = `سفر از ${origin || '?'} به ${dest || '?'}`;

  if (confirm(`آیا از حذف ${displayName} مطمئن هستید؟`)) {
    if (deleteMutation.isPending.value) return;
    deleteMutation.mutate(tripId);
  }
}

function showDetails(tripItem) {
  if (tripItem) {
    selectedTripForDetails.value = tripItem;
  }
}

function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short' }).format(
      new Date(dateString)
    );
  } catch (e) {
    return dateString;
  }
}

function calculateDistance(start, end) {
  if (typeof start === 'number' && typeof end === 'number' && end >= start) {
    return (end - start).toLocaleString() + ' km';
  }
  return '-';
}
</script>
