import Vue from "vue";
import Router from "vue-router";
import goTo from "vuetify/es5/services/goto";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  // This is for the scroll top when click on any router link
  scrollBehavior: (to, from, savedPosition) => {
    let scrollTo = 0;

    if (to.hash) {
      scrollTo = to.hash;
    } else if (savedPosition) {
      scrollTo = savedPosition.y;
    }

    return goTo(scrollTo);
  },
  // This is for the scroll top when click on any router link
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      component: () => import("@/layouts/full-layout/Layout"),
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
    {
      path: "/register",
      name: "Register",
      component: () => import("@/views/auth/register.vue"),
    },
    {
      path: "/confirm",
      name: "RegisterConfirm",
      component: () => import("@/views/auth/register-confirm.vue"),
    },
    {
      path: "/resend",
      name: "ResendConfirm",
      component: () => import("@/views/auth/resend-confirm.vue"),
    },
    {
      path: "/registered",
      name: "Registered",
      component: () => import("@/views/auth/registered.vue"),
    },
    {
      path: "/forgot",
      name: "Forgot",
      component: () => import("@/views/auth/forgot.vue"),
    },
    {
      path: "/changed",
      name: "Changed",
      component: () => import("@/views/auth/changed.vue"),
    },
  ],
});

import NProgress from "nprogress";

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    NProgress.start(800);
  }
  next();
});

router.afterEach(() => {
  // Complete the animation of the route progress bar.
  NProgress.done();
});

export default router;
