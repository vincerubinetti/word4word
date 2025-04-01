import { createApp } from "vue";
import { loadData } from "@/data/word";
import App from "./App.vue";
import { router } from "./router";
import "./styles.css";

export const data = await loadData();
console.log(data);

const app = createApp(App);
app.use(router);
app.mount("#app");
