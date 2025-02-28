import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useStore = defineStore(
  "store",
  () => {
    // State
    const isLogedIn = ref(false);
    const authUser = ref(null);
    const authError = ref(null);
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
    const login = (username, password) => {
      const user = findUser(username, password);
      if (user) {
        isLogedIn.value = true;
        authUser.value = user;
        authError.value = null;
        return true;
      } else {
        authError.value = "Invalid username or password";
        return false;
      }
    };

    const logout = () => {
      isLogedIn.value = false;
      authUser.value = null;
      authError.value = null;
    };

    const addCar = (newCar) => cars.value.push(newCar);
    const addTrip = (newTrip) => trips.value.push(newTrip);
    const updateTrip = (index, newTrip) =>
      trips.value.splice(index, 1, newTrip);
    const deleteTrip = (index) => trips.value.splice(index, 1);
    const addDriver = (newDriver) => drivers.value.push(newDriver);
    const addRepairHistories = (newRepair) =>
      repairHistories.value.push(newRepair);
    const deleteDriver = (index) => drivers.value.splice(index, 1);
    const findUser = (username, password) =>
      users.value.find(
        (user) => user.username === username && user.password === password
      );

    return {
      isLogedIn,
      authUser,
      authError,
      cars,
      users,
      drivers,
      reports,
      trips,
      repairHistories,
      carCount,
      login,
      logout,
      addCar,
      addTrip,
      updateTrip,
      deleteTrip,
      addDriver,
      addRepairHistories,
      deleteDriver,
      findUser,
    };
  },
  { persist: true }
);
