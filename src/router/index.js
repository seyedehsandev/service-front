import { createWebHistory, createRouter } from "vue-router";
import { useStore } from "./../store/useStore";

const routes = [
  {
    path: "/",
    component: () => import("../components/Home.vue"),
    meta: { guest: true },
  },
  {
    path: "/auth/login",
    component: () => import("../components/Login.vue"),
    meta: { guest: true },
  },
  {
    path: "/dashboard",
    component: () => import("../components/Dashboard.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/reports",
    component: () => import("../components/Report.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/insurance-check",
    component: () => import("../components/InsuranceCheck.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/expenses",
    component: () => import("../components/Expenses.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/cars",
    component: () => import("../components/CarForm.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/drivers",
    component: () => import("../components/DriverForm.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/repair-history",
    component: () => import("../components/RepairHistory.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/trip-list",
    component: () => import("../components/TripList.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/fuel",
    component: () => import("../components/Fuel.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("../components/NotFound.vue"),
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
      console.error("Store is not initialized!");
      next("/auth/login");
      return;
    }

    if (to.meta.requiresAuth && !store.isLogedIn) {
      if (to.path !== "/auth/login") {
        next("/auth/login");
      } else {
        next();
      }
    } else if (to.meta.guest && store.isLogedIn) {
      if (to.path !== "/") {
        next("/");
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (error) {
    console.error("Error in navigation guard:", error);
    next("/auth/login");
  }
});

export default router;
