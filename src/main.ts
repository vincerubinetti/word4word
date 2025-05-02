import { createApp } from "vue";
import App from "@/App.vue";
import { run } from "@/data";
import { router } from "@/router";
import { tooltip } from "@/util/tooltip";
import "@/styles.css";
import "tippy.js/dist/tippy.css";

console.debug(import.meta.env);

run();

const app = createApp(App);
app.use(router);
app.directive("tooltip", tooltip);
app.mount("#app");
