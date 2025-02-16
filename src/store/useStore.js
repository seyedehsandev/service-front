import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: () => ({
    isLogedIn: false,
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
    trips: [],
    repairHistories: [],
  }),
  getters: {
    carCount: (state) => state.cars.length,
  },
  actions: {
    loginUser() {
      this.isLogedIn = true;
    },
    logout() {
      this.isLogedIn = false;
    },
    addCar(newcar) {
      this.cars = [...this.cars, newcar];
    },
    addTrip(newtrip) {
      this.trips = [...this.trips, newtrip];
    },
    updateTrip(index, newTrip) {
      this.trips[index] = newTrip;
    },
    deleteTrip(index) {
      this.trips.splice(index, 1);
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
