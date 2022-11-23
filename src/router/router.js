import Vue from "vue"
import Router from "vue-router"
import goTo from "vuetify/es5/services/goto"
import {authRoutes} from "./auth"
import {adminRoutes} from "./admin"
import {userRoutes} from "./user"
import {clientRoutes} from "./client"
import loginRequired from "@/utils/login-required"

Vue.use(Router)

const router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    // This is for the scroll top when click on any router link
    scrollBehavior: (to, from, savedPosition) => {
        let scrollTo = 0

        if (to.hash) {
            scrollTo = to.hash
        } else if (savedPosition) {
            scrollTo = savedPosition.y
        }

        return goTo(scrollTo)
    },
    // This is for the scroll top when click on any router link
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        adminRoutes,
        userRoutes,
        clientRoutes,
        {
            path: "/profile",
            beforeEnter: loginRequired,
            component: () => import("@/layouts/full-layout/Layout"),
            children: [
                {
                    name: "Profile",
                    path: "/",
                    beforeEnter: loginRequired,
                    component: () =>
                        import("@/views/Profile"),
                },
            ]
        },
        {
            path: '/meeting-room',
            component: () => import( '../views/SessionRoom')
        },
        {
            path: '/error',
            component: () => import( '../views/error403')
        },
        {
            path: '/error/403',
            component: () => import( '../views/error403')
        },
        {
            path: '/error/405',
            component: () => import( '../views/error403')
        },
        ...authRoutes,
        {
            path: '*',
            component: () => import( '../views/error404')
        }
    ],
})

import NProgress from "nprogress"

router.beforeResolve((to, from, next) => {
    //const isLoggedIn = !!this.$store.state.tokens.accessToken
    // If this isn't an initial page load.
    if (to.name) {
        // Start the route progress bar.
        NProgress.start(800)
    }
    next()
})

router.afterEach(() => {
    // Complete the animation of the route progress bar.
    NProgress.done()
})

export default router
