import { createApp } from "vue";
import VueTippy from "vue-tippy";
import App from "@/App.vue";
import { run } from "@/data";
import { router } from "@/router";
import "@/styles.css";
import "tippy.js/dist/tippy.css";

console.debug(import.meta.env);

run();

const app = createApp(App);
app.use(router);
app.use(VueTippy, {
  directive: "tooltip",
  defaultProps: {
    delay: [100, 0],
    duration: [100, 0],
    allowHTML: true,
    // onHide: () => false,
  },
});
app.mount("#app");
