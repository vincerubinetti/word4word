import { createRouter, createWebHistory } from "vue-router";
import PageAbout from "@/pages/PageAbout.vue";
import PageCustom from "@/pages/PageCustom.vue";
import PageGame from "@/pages/PageGame.vue";

const routes = [
  { name: "Daily Game", path: "/", component: PageGame },
  { name: "", path: "/:a/:b", component: PageGame },
  { name: "Custom Game", path: "/custom", component: PageCustom },
  { name: "About", path: "/about", component: PageAbout },
];

export const router = createRouter({ history: createWebHistory(), routes });
