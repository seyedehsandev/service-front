import { createWebHistory, createRouter } from "vue-router"; // اصلاح شده

import Home from "./../components/Home.vue";
import Login from "./../components/Login.vue";
import Dashboard from "./../components/Dashboard.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/auth/login", component: Login },
  { path: "/dashboard", component: Dashboard },
];

const router = createRouter({
  history: createWebHistory(), // اصلاح شده
  routes,
});

export default router;
