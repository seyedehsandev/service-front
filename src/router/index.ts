import { createWebHistory, createRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

const routes = [
  {
    path: '/',
    redirect: '/auth/login',
    // name: 'Home',
    // component: () => import('../pages/Home.vue'),
    // meta: { title: 'خانه' },
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
    meta: { guestOnly: true, title: 'ورود' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../pages/Dashboard.vue'),
    meta: { requiresAuth: true, title: 'داشبورد' },
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../pages/Report.vue'),
    meta: { requiresAuth: true, title: 'گزارش' },
  },
  {
    path: '/insurance-check',
    name: 'InsuranceCheck',
    component: () => import('../pages/InsuranceCheck.vue'),
    meta: { requiresAuth: true, title: 'بررسی بیمه' },
  },
  {
    path: '/expenses',
    name: 'Expenses',
    component: () => import('../pages/Expenses.vue'),
    meta: { requiresAuth: true, title: 'مصارف' },
  },
  {
    path: '/cars',
    name: 'Cars',
    component: () => import('../pages/CarForm.vue'),
    meta: { requiresAuth: true, title: 'ماشین ها' },
  },
  {
    path: '/drivers',
    name: 'Drivers',
    component: () => import('../pages/DriverForm.vue'),
    meta: { requiresAuth: true, title: 'راننده ها' },
  },
  {
    path: '/repair-history',
    name: 'RepairHistory',
    component: () => import('../pages/RepairHistory.vue'),
    meta: { requiresAuth: true, title: 'تاریخچه تعمیرات' },
  },
  {
    path: '/trip-list',
    name: 'TripList',
    component: () => import('../pages/TripList.vue'),
    meta: { requiresAuth: true, title: 'لیست سفرها' },
  },
  {
    path: '/fuel',
    name: 'Fuel',
    component: () => import('../pages/Fuel.vue'),
    meta: { requiresAuth: true, title: 'سوخت' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue'),
    meta: { title: 'صفحه یافت نشد' },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes,
});

const DEFAULT_TITLE = 'سیستم مدیریت حمل و نقل';

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  const requiresAuth = to.meta.requiresAuth;
  const guestOnly = to.meta.guestOnly;

  if (!authStore.isLoggedIn && localStorage.getItem('auth')) {
    authStore.checkAuth();
  }

  const isLoggedIn = authStore.isLoggedIn;

  if (requiresAuth && !isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (guestOnly && isLoggedIn) {
    next({ name: 'Dashboard' });
  } else {
    let pageTitle = DEFAULT_TITLE;

    if (to.meta && to.meta.title) {
      if (typeof to.meta.title === 'function') {
        pageTitle = to.meta.title(to) || DEFAULT_TITLE;
      } else {
        pageTitle = to.meta.title;
      }
    }

    document.title = pageTitle;

    next();
  }
});

export default router;
