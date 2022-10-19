import AuthRequired from "@/utils/auth-required";
export const userRoutes = {
    path: '/user',
    redirect: "/user/dashboard",
    component: () => import("@/layouts/full-layout/Layout"),
    beforeEnter: AuthRequired,
    children: [
        {
            name: "Dashboard",
            path: "dashboard",
            beforeEnter: AuthRequired,
            component: () =>
                import("@/views/dashboards/Dashboard.vue"),
        },
        {
            name: "Appointments",
            path: "appointment/list",
            beforeEnter: AuthRequired,
            component: () =>
                import("@/views/user/AppointmentList.vue"),
        },
        {
            name: "Invoices",
            path: "invoice/list",
            beforeEnter: AuthRequired,
            component: () =>
                import("@/views/user/InvoiceList.vue"),
        },
        {
            name: "Clients",
            path: "client/list",
            beforeEnter: AuthRequired,
            component: () =>
                import("@/views/user/ClientList.vue"),
        },
    ],
};