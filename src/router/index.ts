import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  //history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      component: () => import("@/layouts/full/FullLayout.vue"),
      children: [
        {
          name: "Dashboard",
          path: "/dashboard",
          component: () =>
            import("@/views/dashboards/Dashboard.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/auth/login.vue"),
    },

  ],
});

export default router;
