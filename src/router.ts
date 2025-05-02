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
    path: "/",
    component: PageGame,
    meta: {
      name: "Daily Game",
      header: true,
      icon: Calendar1,
      tooltip: "Daily Game",
    },
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
    path: "/custom",
    component: PageCustom,
    meta: {
      name: "Custom Game",
      header: true,
      icon: PencilRuler,
      tooltip: "Custom Game",
    },
  },
  {
    path: "/saved",
    component: PageSaved,
    meta: {
      name: "Saved Games",
      header: computed(() => !isEmpty(savedGames.value)),
      icon: Bookmark,
      tooltip: "Saved Games",
    },
  },
  {
    path: "/about",
    component: PageAbout,
    meta: {
      name: "About",
      header: true,
      icon: BadgeHelp,
      tooltip: "About",
    },
  },
  {
    path: "/:a([A-Za-z]{4})/:b([A-Za-z]{4})",
    component: PageGame,
    meta: {
      name: "Custom Game",
      header: false,
      icon: null,
      tooltip: "",
    },
  },
  ...(import.meta.env.DEV
    ? [
        {
          name: "Icons",
          path: "/icons",
          component: PageIcons,
          meta: {
            name: "Icons",
            header: false,
            icon: null,
            tooltip: "",
          },
        },
      ]
    : []),
  {
    path: "/:pathMatch(.*)*",
    component: PageGame,
    meta: {
      name: "Not Found",
      header: false,
      icon: null,
      tooltip: "",
    },
    beforeEnter: () => "/",
  },
] as const;

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
