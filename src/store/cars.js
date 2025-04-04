// stores/cars.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
// import axios from 'axios'; // اگر قصد دارید از API واقعی استفاده کنید، این را uncomment کنید و نصب کنید

export const useCarStore = defineStore(
  'cars', // شناسه منحصر به فرد استور
  () => {
    // --- State ---
    // آرایه‌ای برای نگهداری لیست خودروها
    const cars = ref([]);

    // --- Getters ---
    // محاسبه تعداد خودروها
    const carCount = computed(() => cars.value.length);

    // پیدا کردن خودرو بر اساس ID
    const getCarById = computed(() => {
      // این یک تابع برمی‌گرداند که ID می‌گیرد
      return (carId) => cars.value.find((car) => car.id === carId);
    });

    // --- Actions ---

    // افزودن خودرو جدید
    const addCar = (newCar) => {
      // تولید ID منحصر به فرد (روش ساده)
      const newId =
        cars.value.length > 0
          ? Math.max(...cars.value.map((c) => c.id || 0)) + 1
          : 1;
      // ایجاد آبجکت نهایی با ID
      const carToAdd = { ...newCar, id: newId };
      // افزودن به آرایه state
      cars.value.push(carToAdd);
      console.log('Car added:', carToAdd);
      // می توانید true برگردانید برای نشان دادن موفقیت
      // return true;
    };

    // حذف خودرو بر اساس ID
    const deleteCar = (carId) => {
      const initialLength = cars.value.length;
      // فیلتر کردن آرایه برای حذف خودروی مورد نظر
      cars.value = cars.value.filter((car) => car.id !== carId);
      // بررسی و بازگرداندن نتیجه
      if (initialLength > cars.value.length) {
        console.log('Car deleted with id:', carId);
        return true; // موفقیت آمیز
      }
      console.warn('Car not found for deletion with id:', carId);
      return false; // ناموفق (پیدا نشد)
    };

    // به‌روزرسانی خودرو بر اساس ID
    const updateCar = (updatedCar) => {
      // اطمینان از وجود ID در داده‌های آپدیت
      if (!updatedCar || !updatedCar.id) {
        console.error('Cannot update car: ID is missing in updated data.');
        return false;
      }
      // پیدا کردن ایندکس خودرو
      const index = cars.value.findIndex((car) => car.id === updatedCar.id);
      // اگر پیدا شد، آپدیت کن
      if (index !== -1) {
        // ادغام داده‌های قدیمی و جدید، با حفظ ID اصلی
        cars.value[index] = {
          ...cars.value[index], // داده های قبلی
          ...updatedCar, // داده های جدید (جایگزین موارد مشابه)
          id: cars.value[index].id, // اطمینان از حفظ ID اصلی
        };
        console.log('Car updated:', cars.value[index]);
        return true; // موفقیت آمیز
      }
      // اگر پیدا نشد
      console.warn('Car not found for update with id:', updatedCar.id);
      return false; // ناموفق
    };

    // ** اکشن جدید برای بارگذاری داده‌ها **
    const fetchCars = async () => {
      // اگر داده‌ها از قبل (مثلا توسط persist) بارگذاری شده‌اند، دوباره fetch نکن
      if (cars.value.length > 0) {
        console.log(
          'Cars already loaded via persist/previous fetch, count:',
          cars.value.length
        );
        return; // یا return cars.value;
      }

      console.log('Executing fetchCars action...');
      // --- منطق دریافت داده‌ها ---
      // اینجا می‌توانید کد فراخوانی API یا خواندن از منبع دیگر را قرار دهید

      // مثال: استفاده از داده‌های نمونه (اگر API ندارید یا برای تست)
      if (cars.value.length === 0) {
        // دوباره چک می‌کنیم خالی باشد
        console.log('Using dummy car data for fetchCars.');
        // تاخیر مصنوعی برای شبیه‌سازی فراخوانی شبکه (اختیاری)
        await new Promise((resolve) => setTimeout(resolve, 500));
        cars.value = [
          {
            id: 1,
            brand: 'ایران خودرو',
            model: 'دنا پلاس',
            plate: '۱۱الف۱۱۱ایران۱۱',
            driverId: 1,
          }, // driverId نمونه
          {
            id: 2,
            brand: 'سایپا',
            model: 'شاهین',
            plate: '۲۲ب۲۲۲ایران۲۲',
            driverId: 2,
          }, // driverId نمونه
          {
            id: 3,
            brand: 'پارس خودرو',
            model: 'کوییک',
            plate: '۳۳ج۳۳۳ایران۳۳',
            driverId: null,
          }, // بدون راننده
        ];
        console.log('Dummy cars loaded:', cars.value.length);
      }

      // مثال فراخوانی API واقعی (نیاز به axios یا fetch):
      // try {
      //   console.log('Fetching cars from API...');
      //   const response = await axios.get('/api/cars'); // آدرس صحیح API
      //   cars.value = response.data;
      //   console.log('Cars successfully fetched from API:', cars.value.length);
      // } catch (error) {
      //   console.error('Failed to fetch cars from API:', error);
      //   // اینجا می‌توانید خطا را مدیریت کنید، مثلا یک state خطا را تنظیم کنید
      //   // errorState.value = 'خطا در دریافت لیست خودروها';
      // }
      // ---------------------------
    };
    // --- پایان اکشن fetchCars ---

    // مقادیری که استور در اختیار کامپوننت‌ها قرار می‌دهد
    return {
      // State
      cars,
      // Getters
      carCount,
      getCarById,
      // Actions
      addCar,
      deleteCar,
      updateCar,
      fetchCars, // <<< --- fetchCars به لیست اضافه شد
    };
  },
  {
    // فعال کردن قابلیت persist برای ذخیره state در localStorage
    persist: true,
  }
);
