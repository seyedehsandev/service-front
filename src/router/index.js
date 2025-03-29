import { createWebHistory, createRouter } from 'vue-router';
import { useStore } from './../store/useStore';

const routes = [
  {
    path: '/',
    component: () => import('../pages/Home.vue'),
  },
  {
    path: '/auth/login',
    component: () => import('../pages/Login.vue'),
  },
  {
    path: '/dashboard',
    component: () => import('../pages/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/reports',
    component: () => import('../pages/Report.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/insurance-check',
    component: () => import('../pages/InsuranceCheck.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/expenses',
    component: () => import('../pages/Expenses.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cars',
    component: () => import('../pages/CarForm.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/drivers',
    component: () => import('../pages/DriverForm.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/repair-history',
    component: () => import('../pages/RepairHistory.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/trip-list',
    component: () => import('../pages/TripList.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/fuel',
    component: () => import('../pages/Fuel.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../pages/NotFound.vue'),
    meta: { guest: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  try {
    const store = useStore();
    if (!store) {
      console.error('Store is not initialized!');
      next('/auth/login');
      return;
    }

    if (to.meta.requiresAuth && !store.isLoggedIn) {
      if (to.path !== '/auth/login') {
        next('/auth/login');
      } else {
        next();
      }
    } else if (to.meta.guest && store.isLoggedIn) {
      if (to.path !== '/') {
        next('/');
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (error) {
    console.error('Error in navigation guard:', error);
    next('/auth/login');
  }
});

export default router;
