<template>
    <h1>گزارش راننده</h1>
    <table>
        <th>
            <td>راننده</td>
            <td>تعداد سفر</td>
            <td>مجموع مسافت طی شده</td>
            <td>تعمیر گزارش شده</td>
            <td>جریمه گزارش شده</td>
            <td>وضعیت گواهینامه</td>
            <td>مجموع هزینه</td>
        </th>
    </table>
</template>
<script setup>
import {ref} from 'vue';


import {useStore} from 'vuex';

const store = useStore();
const drivers = ref(store.state.drivers);
const trips = ref(store.state.trips);
const expenses = ref(store.state.expenses);
const findExpireTime = (driverCode) => {

    const driver = drivers.value.find(driver => driver.code === driverCode);
    return driver.licenceExpireTime;
}
const findDriverTrips = (driverCode) => {

    const driverTrips = trips.value.filter(trip => trip.driver === driverCode);
    const tripsCount = driverTrips.length;
    const tripsDistance = driverTrips.reduce((total, trip) => total + trip.distance, 0);

    return {tripsCount, tripsDistance};
}

const findDriverAllCost = (driverCode) => {
    const tripsCost = trips.value.filter(trip => trip.driver === driverCode).reduce((total, trip) => total + trip.cost, 0);
    const findDriverPallet= (driverCode) => {
        const driver = drivers.value.find(driver => driver.code === driverCode);
        return driver.pallet;




    }

}

</script>