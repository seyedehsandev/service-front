import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useStore = defineStore(
  "store",
  () => {
    // State
    const isLogedIn = ref(false);
    const cars = ref([]);
    const users = ref([
      { id: 1, username: "ehsan@gmail.com", password: "0147AAaa#" },
    ]);
    const drivers = ref([]);
    const reports = ref([]);
    const trips = ref([]);
    const repairHistories = ref([]);

    // Getters
    const carCount = computed(() => cars.value.length);

    // Actions
    const loginUser = () => (isLogedIn.value = true);
    const logout = () => (isLogedIn.value = false);
    const addCar = (newCar) => cars.value.push(newCar);
    const addTrip = (newTrip) => trips.value.push(newTrip);
    const updateTrip = (index, newTrip) =>
      trips.value.splice(index, 1, newTrip);
    const deleteTrip = (index) => trips.value.splice(index, 1);
    const addDriver = (newDriver) => drivers.value.push(newDriver);
    const addRepairHistories = (newRepair) =>
      repairHistories.value.push(newRepair);
    const deleteDriver = (index) => drivers.value.splice(index, 1);
    const findUser = (u, p) =>
      users.value.find((user) => user.username === u && user.password === p);

    return {
      isLogedIn,
      cars,
      users,
      drivers,
      reports,
      trips,
      repairHistories,
      carCount,
      loginUser,
      logout,
      addCar,
      addTrip,
      updateTrip,
      deleteTrip,
      addDriver,
      addRepairHistories: addRepairHistories,
      deleteDriver,
      findUser,
    };
  },
  { persist: true }
);
