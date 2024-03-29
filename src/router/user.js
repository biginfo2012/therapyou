import AuthRequired from "@/utils/auth-required";

export const userRoutes = {
    path: '/user',
    redirect: "/user/appointment/list",
    component: () => import("@/layouts/full-layout/Layout"),
    beforeEnter: AuthRequired,
    children: [
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
        {
            name: "Notifications",
            path: "notification/list",
            beforeEnter: AuthRequired,
            component: () =>
                import("@/views/user/NotificationList.vue"),
        },
        {
            name: "Messages",
            path: "message/list",
            beforeEnter: AuthRequired,
            component: () =>
                import("@/views/user/MessageList.vue"),
        },
    ],
}