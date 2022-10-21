export const authRoutes = [
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
]