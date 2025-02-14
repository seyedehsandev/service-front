import { defineStore } from "pinia";
import { useRouter } from "vue-router";

const router = useRouter();

export const useStore = defineStore("store", {
  state: () => ({
    cars: [],
    users: [
      {
        id: 1,
        username: "ehsan@gmail.com",
        password: "0147AAaa#",
      },
    ],
    drivers: [],
    reports: [],
    travels: [],
    repairHistories: [],
  }),
  getters: {
    carCount: (state) => state.cars.length,
  },
  actions: {
    addCar(newcar) {
      this.cars = [...this.cars, newcar];
    },
    addDriver(newdriver) {
      this.drivers = [...this.drivers, newdriver];
    },
    addRepairHistories(newRepairHistory) {
      this.repairHistories = [...this.repairHistories, newRepairHistory];
    },

    findUser(username, password) {
      return this.users.find(
        (user) => user.username === username && user.password === password
      );
    },
  },
  persist: true,
});
