import { createWebHistory, createRouter } from "vue-router";

import Home from "./../components/Home.vue";
import Login from "./../components/Login.vue";
import Dashboard from "./../components/Dashboard.vue";
import Report from "./../components/Report.vue";
import AddDailyReport from "./../components/AddDailyReport.vue";
import CarForm from "./../components/CarForm.vue";
import DriverForm from "./../components/DriverForm.vue";
import RepairHistory from "./../components/RepairHistory.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/auth/login", component: Login },
  { path: "/reports", component: AddDailyReport },
  { path: "/cars", component: CarForm },
  { path: "/drivers", component: DriverForm },
  { path: "/repairhistory", component: RepairHistory },

  {
    path: "/dashboard",
    component: Dashboard,
    children: [
      {
        path: "report",
        component: Report,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
