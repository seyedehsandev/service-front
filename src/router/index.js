import { createWebHistory, createRouter } from 'vue-router';
import { useAuthStore } from '../store/auth.js';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue'),
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../pages/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../pages/Report.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/insurance-check',
    name: 'InsuranceCheck',
    component: () => import('../pages/InsuranceCheck.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/expenses',
    name: 'Expenses',
    component: () => import('../pages/Expenses.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cars',
    name: 'Cars',
    component: () => import('../pages/CarForm.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/drivers',
    name: 'Drivers',
    component: () => import('../pages/DriverForm.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/repair-history',
    name: 'RepairHistory',
    component: () => import('../pages/RepairHistory.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/trip-list',
    name: 'TripList',
    component: () => import('../pages/TripList.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/fuel',
    name: 'Fuel',
    component: () => import('../pages/Fuel.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  const requiresAuth = to.meta.requiresAuth;
  const guestOnly = to.meta.guestOnly;

  if (!authStore.isLoggedIn && localStorage.getItem('auth')) {
    console.log(
      'Guard: Auth state not loaded, attempting to restore from storage...'
    );
    authStore.checkAuth();
  }

  const isLoggedIn = authStore.isLoggedIn;

  console.log(
    `Navigating to: ${to.path} | requiresAuth: ${requiresAuth} | guestOnly: ${guestOnly} | isLoggedIn: ${isLoggedIn}`
  );

  if (requiresAuth && !isLoggedIn) {
    console.log('Guard: Redirecting to Login (auth required)');
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (guestOnly && isLoggedIn) {
    console.log(
      'Guard: Redirecting to Dashboard (guest page accessed while logged in)'
    );
    next({ name: 'Dashboard' });
  } else {
    console.log('Guard: Allowing navigation');
    next();
  }
});

export default router;
