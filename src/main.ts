import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persistedstate";
//@ts-ignore
import router from "./router";

const pinia = createPinia();
pinia.use(piniaPersist); 

const app = createApp(App);
app.use(pinia);  
app.use(router);
app.mount("#app");
