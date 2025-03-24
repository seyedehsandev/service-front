// stores/dateStore.js
import { defineStore } from "pinia";
import { j2d, g2d } from "jalaali-js";

export const useDateStore = defineStore("date", {
  actions: {
    getDifferenceWithToday(year, month, day) {
      const today = new Date();
      const todayGregorian = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      };
      const todayJDN = g2d(
        todayGregorian.year,
        todayGregorian.month,
        todayGregorian.day
      );
      const inputJDN = j2d(year, month, day);
      return inputJDN - todayJDN;
    },
  },
});
