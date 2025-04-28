import { computed } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { isEmpty } from "lodash";
import { BadgeHelp, Bookmark, Calendar1, PencilRuler } from "lucide-vue-next";
import PageAbout from "@/pages/PageAbout.vue";
import PageCustom from "@/pages/PageCustom.vue";
import PageGame from "@/pages/PageGame.vue";
import PageIcons from "@/pages/PageIcons.vue";
import PageSaved from "@/pages/PageSaved.vue";
import { savedGames } from "@/util/storage";

export const routes = [
  {
    name: "Daily",
    path: "/",
    component: PageGame,
    meta: { header: true, icon: Calendar1, tooltip: "Daily game" },
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
    meta: { header: true, icon: PencilRuler, tooltip: "Custom game" },
  },
  {
    name: "Saved",
    path: "/saved",
    component: PageSaved,
    meta: {
      header: computed(() => !isEmpty(savedGames.value)),
      icon: Bookmark,
      tooltip: "Saved games",
    },
  },
  {
    name: "About",
    path: "/about",
    component: PageAbout,
    meta: { header: true, icon: BadgeHelp, tooltip: "How to play, info, about" },
  },
  {
    name: "",
    path: "/:a([A-Za-z]{4})/:b([A-Za-z]{4})",
    component: PageGame,
    meta: {},
  },
  ...(import.meta.env.DEV
    ? [
        {
          name: "icons",
          path: "/icons",
          component: PageIcons,
          meta: {},
        },
      ]
    : []),
  {
    name: "404",
    path: "/:pathMatch(.*)*",
    component: PageGame,
    meta: {},
    beforeEnter: () => "/",
  },
] as const;

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
