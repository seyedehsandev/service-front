// stores/drivers.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useDriverStore = defineStore(
  'drivers',
  () => {
    // این آرایه دیگر منبع اصلی داده نیست، Vue Query کش خود را دارد
    const drivers = ref([]);

    // این computed همچنان می‌تواند مفید باشد اگر داده‌های کش شده Vue Query را در drivers کپی کنیم
    // یا مستقیماً از داده‌های useQuery استفاده کنیم. فعلاً آن را بر اساس ref داخلی نگه می‌داریم.
    const driverCount = computed(() => drivers.value.length);

    // این getter دیگر کاربرد زیادی ندارد اگر از useQuery برای گرفتن تکی هم استفاده کنیم
    const getDriverById = computed(() => {
      return (driverId) =>
        drivers.value.find((driver) => driver.id === driverId);
    });

    // اکشن‌های fetch, add, update, delete حذف می‌شوند چون توسط useQuery و useMutation مدیریت خواهند شد.

    // می‌توان یک تابع برای همگام‌سازی داده‌های Vue Query با این استور گذاشت (اختیاری)
    const setDriversFromQuery = (driversData) => {
      drivers.value = driversData || [];
    };

    return {
      drivers, // بیشتر برای نمایش count یا کارهای جانبی
      driverCount,
      getDriverById, // کاربرد محدود
      setDriversFromQuery, // اختیاری
    };
  }
  // { persist: true }  <-- حذف شد
);
