import { createRouter, createWebHistory } from "vue-router";
import PageAbout from "@/pages/PageAbout.vue";
import PageCustom from "@/pages/PageCustom.vue";
import PageGame from "@/pages/PageGame.vue";

const routes = [
  { name: "Daily", path: "/", component: PageGame },
  { name: "Custom", path: "/:from/:to", component: PageGame },
  { name: "Custom", path: "/custom", component: PageCustom },
  { name: "About", path: "/about", component: PageAbout },
];

export const router = createRouter({ history: createWebHistory(), routes });
