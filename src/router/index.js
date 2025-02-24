import { createWebHistory, createRouter } from "vue-router";

import Home from "./../components/Home.vue";
import Login from "./../components/Login.vue";
import Dashboard from "./../components/Dashboard.vue";
import Report from "./../components/Report.vue";
import CarForm from "./../components/CarForm.vue";
import DriverForm from "./../components/DriverForm.vue";
import RepairHistory from "./../components/RepairHistory.vue";
import TripList from "./../components/TripList.vue";
import InsuranceCheck from "./../components/InsuranceCheck.vue";
const routes = [
  { path: "/", component: Home },
  { path: "/auth/login", component: Login },
  { path: "/dashboard/reports", component: Report },
  { path: "/dashboard/insurancecheck", component: InsuranceCheck },

  { path: "/dashboard/cars", component: CarForm },
  { path: "/dashboard/drivers", component: DriverForm },
  { path: "/dashboard/repairhistory", component: RepairHistory },
  { path: "/dashboard/triplist", component: TripList },

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
