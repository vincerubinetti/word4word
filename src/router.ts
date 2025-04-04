import { createRouter, createWebHistory } from "vue-router";
import PageAbout from "@/pages/PageAbout.vue";
import PageCustom from "@/pages/PageCustom.vue";
import PageGame from "@/pages/PageGame.vue";

export const routes = [
  {
    name: "Daily",
    path: "/",
    component: PageGame,
    meta: { header: true },
    beforeEnter: () => {
      const path = window.sessionStorage.redirectPath;
      if (typeof path === "string") {
        console.debug("Redirecting to:", path);
        window.sessionStorage.removeItem("redirectPath");
        return path;
      }
    },
  },
  {
    name: "Custom",
    path: "/custom",
    component: PageCustom,
    meta: { header: true },
  },
  {
    name: "About",
    path: "/about",
    component: PageAbout,
    meta: { header: true },
  },
  {
    name: "",
    path: "/:a([A-Za-z]{4})/:b([A-Za-z]{4})",
    component: PageGame,
    meta: { header: false },
  },
  {
    name: "404",
    path: "/:pathMatch(.*)*",
    component: PageGame,
    meta: { header: false },
    beforeEnter: () => "/",
  },
] as const;

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
